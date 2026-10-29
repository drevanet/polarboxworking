import { NextRequest, NextResponse } from "next/server";
import { webhooks } from "@polar-sh/sdk/2026-10";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = process.env.POLAR_WEBHOOK_SECRET;

  if (!secret) {
    console.error("POLAR_WEBHOOK_SECRET is missing.");

    return NextResponse.json(
      { error: "Webhook is not configured." },
      { status: 500 }
    );
  }

  // Verify the original request body and webhook signature.
  let event: any;

  try {
    const rawBody = await req.text();

    const headers = {
      "webhook-id": req.headers.get("webhook-id") ?? "",
      "webhook-timestamp":
        req.headers.get("webhook-timestamp") ?? "",
      "webhook-signature":
        req.headers.get("webhook-signature") ?? "",
    };

    event = await webhooks.validateEvent(
      rawBody,
      headers,
      secret
    );
  } catch (error) {
    console.error(
      "Polar signature verification failed:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 403 }
    );
  }

  try {
    console.log("Received Polar event:", event.type);

    const allowedEvents = [
      "subscription.created",
      "subscription.updated",
      "subscription.active",
      "subscription.canceled",
      "subscription.uncanceled",
      "subscription.revoked",
      "subscription.past_due",
    ];

    if (!allowedEvents.includes(event.type)) {
      return NextResponse.json({ received: true });
    }

    const d = event.data;

    if (!d?.id || !d?.product_id) {
      console.error("Missing subscription details:", {
        eventType: event.type,
        hasSubscriptionId: Boolean(d?.id),
        hasProductId: Boolean(d?.product_id),
      });

      return NextResponse.json(
        { error: "Missing subscription details." },
        { status: 400 }
      );
    }

    // Resolve the plan from checkout metadata or configured products.
    const plan =
      d?.metadata?.plan ??
      (d.product_id === process.env.POLAR_PRODUCT_MONTHLY
        ? "monthly"
        : d.product_id === process.env.POLAR_PRODUCT_BIWEEKLY
          ? "biweekly"
          : d.product_id === process.env.POLAR_PRODUCT_YEARLY
            ? "yearly"
            : null);

    if (!["monthly", "biweekly", "yearly"].includes(plan)) {
      console.error("Unknown Polar product or plan:", {
        productId: d.product_id,
        plan: plan ?? null,
      });

      return NextResponse.json(
        { error: "Unknown subscription product." },
        { status: 400 }
      );
    }

    // Get the possible user identifiers from the event.
    const externalId =
      d?.customer?.external_id ??
      d?.external_customer_id ??
      d?.metadata?.userId ??
      null;

    const customerEmail =
      d?.customer?.email ??
      d?.customer_email ??
      null;

    let user = null;

    // First attempt: match the database user ID.
    if (externalId) {
      user = await prisma.user.findUnique({
        where: { id: String(externalId) },
        select: { id: true, email: true },
      });
    }

    // Second attempt: match the customer's email.
    if (!user && customerEmail) {
      user = await prisma.user.findUnique({
        where: {
          email: String(customerEmail).trim().toLowerCase(),
        },
        select: { id: true, email: true },
      });
    }

    if (!user) {
      console.error("Polar user mapping failed:", {
        eventType: event.type,
        subscriptionId: d.id,
        productId: d.product_id,
        externalId: externalId ? String(externalId) : null,
        hasCustomerEmail: Boolean(customerEmail),
      });

      // Do not acknowledge an event that has not been processed.
      return NextResponse.json(
        { error: "User not found. Check Polar customer mapping." },
        { status: 404 }
      );
    }

    // Map the Polar event to the application's subscription status.
    const statuses: Record<string, string> = {
      "subscription.created": d.status ?? "inactive",
      "subscription.updated": d.status ?? "inactive",
      "subscription.active": "active",
      "subscription.canceled": "canceled",
      "subscription.uncanceled": "active",
      "subscription.revoked": "revoked",
      "subscription.past_due": "past_due",
    };

    const status = statuses[event.type];

    const periodStart = d.current_period_start
      ? new Date(d.current_period_start)
      : null;

    const periodEnd = d.current_period_end
      ? new Date(d.current_period_end)
      : null;

    const customerId =
      d.customer_id ?? d.customer?.id ?? null;

    // Create the subscription if necessary, or update the existing one.
    await prisma.subscription.upsert({
      where: {
        userId: user.id,
      },

      create: {
        userId: user.id,
        polarCustomerId: customerId,
        polarSubscriptionId: d.id,
        polarProductId: d.product_id,
        planKey: plan,
        status,
        downloadCount: 0,
        periodStart,
        periodEnd,
      },

      update: {
        polarCustomerId: customerId ?? undefined,
        polarSubscriptionId: d.id,
        polarProductId: d.product_id,
        planKey: plan,
        status,
        periodStart,
        periodEnd,
      },
    });

    console.log("Reva Box subscription updated successfully:", {
      userId: user.id,
      plan,
      status,
      subscriptionId: d.id,
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Polar webhook processing failed:", error);

    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 }
    );
  }
}