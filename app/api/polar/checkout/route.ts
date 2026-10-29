import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createPolar } from "@polar-sh/sdk/2026-10";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

const products: Record<string, string | undefined> = {
  monthly: process.env.POLAR_PRODUCT_MONTHLY,
  biweekly: process.env.POLAR_PRODUCT_BIWEEKLY,
  yearly: process.env.POLAR_PRODUCT_YEARLY,
};

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      const loginUrl = new URL("/login", req.url);

      loginUrl.searchParams.set(
        "callbackUrl",
        `${req.nextUrl.pathname}${req.nextUrl.search}`
      );

      return NextResponse.redirect(loginUrl);
    }

    const plan = req.nextUrl.searchParams.get("plan");
    const productId = plan ? products[plan] : undefined;
    const token = process.env.POLAR_ACCESS_TOKEN;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!token || !appUrl) {
      console.error("Polar configuration is incomplete.");

      return NextResponse.json(
        { error: "Polar is not configured." },
        { status: 500 }
      );
    }

    if (!plan || !productId) {
      return NextResponse.json(
        { error: "Invalid plan or missing product ID." },
        { status: 400 }
      );
    }

    const polar = createPolar({
      accessToken: token,
      environment:
        process.env.POLAR_ENVIRONMENT === "sandbox"
          ? "sandbox"
          : "production",
    });

    // The external customer ID must be the actual database User.id.
    const userId = session.user.id;

    console.log("Creating Polar checkout:", {
      plan,
      productId,
      hasUserId: Boolean(userId),
      hasEmail: Boolean(session.user.email),
    });

    const checkout = await polar.checkouts.create({
      products: [productId],
      success_url: `${appUrl}/editor?checkout=success`,
      customer_email: session.user.email ?? undefined,
      external_customer_id: userId,
      metadata: {
        plan,
        userId,
        source: "reva-box",
      },
    });

    return NextResponse.redirect(checkout.url);
  } catch (error) {
    console.error("Polar checkout error:", error);

    return NextResponse.json(
      { error: "Could not create checkout session." },
      { status: 500 }
    );
  }
}