
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Polar } from "@polar-sh/sdk";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

const products: Record<string, string | undefined> = {
  monthly: process.env.POLAR_PRODUCT_MONTHLY,
  biweekly: process.env.POLAR_PRODUCT_BIWEEKLY,
  yearly: process.env.POLAR_PRODUCT_YEARLY,
};

export async function GET(req: NextRequest) {
  const plan = req.nextUrl.searchParams.get("plan");
  const productId = plan ? products[plan] : undefined;

  // Validate the selected plan.
  if (!plan || !productId) {
    return NextResponse.json(
      { error: "Invalid plan or missing Polar product ID." },
      { status: 400 }
    );
  }

  // Check the user's authentication status.
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    const callbackUrl = `/api/polar/checkout?plan=${encodeURIComponent(plan)}`;

    const signupUrl = new URL("/signup", req.url);
    signupUrl.searchParams.set("callbackUrl", callbackUrl);
    signupUrl.searchParams.set("plan", plan);

    return NextResponse.redirect(signupUrl);
  }

  const token = process.env.POLAR_ACCESS_TOKEN;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!token || !appUrl) {
    return NextResponse.json(
      { error: "Polar is not configured." },
      { status: 500 }
    );
  }

  try {
    const polar = new Polar({
      accessToken: token,
      server:
        process.env.POLAR_ENVIRONMENT === "sandbox"
          ? "sandbox"
          : "production",
    });

    const checkout = await polar.checkouts.create({
      products: [productId],
      successUrl: `${appUrl}/editor?checkout=success`,
      customerEmail: session.user.email ?? undefined,
      externalCustomerId: session.user.id,
      metadata: {
        plan,
        userId: session.user.id,
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
