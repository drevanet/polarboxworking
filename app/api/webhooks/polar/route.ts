
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

  // Verify the signature using the original request body.
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

    event = await webhooks.validateEvent(rawBody, headers, secret);
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

    // Match the Polar subscription to your Reva Box account.
    const userId =
      d?.customer?.external_id ??
      d?.external_customer_id ??
      d?.metadata?.userId;

    if (!userId || !d?.id || !d?.product_id) {
      console.error("Missing subscription mapping:", {
        eventType: event.type,
        subscriptionId: d?.id,
        productId: d?.product_id,
        hasUserId: Boolean(userId),
      });

      return NextResponse.json(
        { error: "Missing subscription mapping metadata." },
        { status: 400 }
      );
    }

    const plan =
      d?.metadata?.plan ??
      (d.product_id === process.env.POLAR_PRODUCT_MONTHLY
        ? "monthly"
        : d.product_id === process.env.POLAR_PRODUCT_BIWEEKLY
          ? "biweekly"
          : d.product_id === process.env.POLAR_PRODUCT_YEARLY
            ? "yearly"
            : null);

    if (!plan) {
      console.error("Unknown Polar product:", d.product_id);

      return NextResponse.json(
        { error: "Unknown subscription product." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: String(userId) },
      select: { id: true },
    });

    if (!user) {
      console.error("No Reva Box user found for Polar customer:", userId);

      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

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

    await prisma.subscription.upsert({
      where: { userId: user.id },

      create: {
        userId: user.id,
        polarCustomerId:
          d.customer_id ?? d.customer?.id ?? null,
        polarSubscriptionId: d.id,
        polarProductId: d.product_id,
        planKey: plan,
        status,
        downloadCount: 0,
        periodStart,
        periodEnd,
      },

      update: {
        polarCustomerId:
          d.customer_id ?? d.customer?.id ?? undefined,
        polarSubscriptionId: d.id,
        polarProductId: d.product_id,
        planKey: plan,
        status,
        periodStart,
        periodEnd,
      },
    });

    console.log("Reva Box subscription updated:", {
      userId: user.id,
      plan,
      status,
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
