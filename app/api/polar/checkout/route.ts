
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

  let event;

  try {
    // Signature verification requires the original, unmodified body.
    const rawBody = await req.text();

    event = await webhooks.validateEvent(
      rawBody,
      {
        "webhook-id": req.headers.get("webhook-id") ?? "",
        "webhook-timestamp":
          req.headers.get("webhook-timestamp") ?? "",
        "webhook-signature":
          req.headers.get("webhook-signature") ?? "",
      },
      secret
    );
  } catch (error) {
    console.error(
      "Polar webhook signature verification failed:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 403 }
    );
  }

  try {
    console.log("Verified Polar webhook event:", event.type);

    switch (event.type) {
      case "subscription.created":
      case "subscription.updated": {
        const subscription = event.data;

        const userId = subscription.customer.external_id;
        const subscriptionId = subscription.id;
        const productId = subscription.product_id;

        if (!userId) {
          console.error(
            "Subscription event has no external customer ID.",
            subscriptionId
          );

          return NextResponse.json(
            { error: "Missing external customer ID." },
            { status: 400 }
          );
        }

        const status = subscription.status;
        const isActive =
          status === "active" || status === "trialing";

        const planKey =
          productId === process.env.POLAR_PRODUCT_MONTHLY
            ? "monthly"
            : productId === process.env.POLAR_PRODUCT_BIWEEKLY
              ? "biweekly"
              : productId === process.env.POLAR_PRODUCT_YEARLY
                ? "yearly"
                : null;

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            polarSubscriptionId: subscriptionId,
            polarCustomerId: subscription.customer_id,
            polarProductId: productId,
            planKey,
            status: isActive ? status : status,
          },
          update: {
            polarSubscriptionId: subscriptionId,
            polarCustomerId: subscription.customer_id,
            polarProductId: productId,
            planKey,
            status,
          },
        });

        break;
      }

      case "subscription.canceled": {
        const subscription = event.data;
        const userId = subscription.customer.external_id;

        if (userId) {
          await prisma.subscription.updateMany({
            where: {
              userId,
              polarSubscriptionId: subscription.id,
            },
            data: {
              status: subscription.status,
            },
          });
        }

        break;
      }

      default:
        // Other events can be acknowledged without changing subscription data.
        console.log("No subscription update required for:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Polar webhook processing failed:", error);

    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 }
    );
  }
}
