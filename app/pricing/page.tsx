
"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

const plans = [
  {
    name: "Biweekly",
    price: "$7",
    period: "every 2 weeks",
    description: "Unlimited downloads for active creators.",
    features: [
      "Unlimited project downloads",
      "Access to the 3D box editor",
      "Upload artwork to all six faces",
      "PNG downloads",
    ],
    planKey: "biweekly",
    popular: false,
  },
  {
    name: "Monthly",
    price: "$10",
    period: "per month",
    description: "Perfect for regular packaging projects.",
    features: [
      "50 project downloads",
      "Access to the 3D box editor",
      "Upload artwork to all six faces",
      "PNG downloads",
    ],
    planKey: "monthly",
    popular: true,
  },
  {
    name: "Yearly",
    price: "$98",
    period: "per year",
    description: "The best value for serious creators.",
    features: [
      "Unlimited project downloads",
      "Access to the 3D box editor",
      "Upload artwork to all six faces",
      "PNG downloads",
    ],
    planKey: "yearly",
    popular: false,
  },
];

export default function PricingPage() {
  const { data: session, status } = useSession();

  function getPlanUrl(planKey: string) {
    if (status === "loading") {
      return "#";
    }

    if (session?.user) {
      return `/api/polar/checkout?plan=${planKey}`;
    }

    return `/signup?plan=${planKey}`;
  }

  return (
    <main className="min-h-screen bg-[#080811] px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-violet-400">
            Simple pricing
          </p>

          <h1 className="text-4xl font-bold md:text-6xl">
            Choose your creative plan
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-gray-400">
            Create professional 3D packaging mockups with Reva Box.
            Choose the plan that works best for you.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.planKey}
              className={`relative flex flex-col rounded-3xl border p-8 ${
                plan.popular
                  ? "border-violet-500 bg-violet-500/10 shadow-2xl shadow-violet-950/30"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              {plan.popular && (
                <span className="absolute right-6 top-6 rounded-full bg-violet-500 px-3 py-1 text-xs font-semibold">
                  MOST POPULAR
                </span>
              )}

              <h2 className="text-2xl font-semibold">{plan.name}</h2>

              <p className="mt-3 min-h-12 text-sm text-gray-400">
                {plan.description}
              </p>

              <div className="mt-7">
                <span className="text-5xl font-bold">{plan.price}</span>
                <span className="ml-2 text-sm text-gray-400">
                  {plan.period}
                </span>
              </div>

              <ul className="my-8 flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-gray-300"
                  >
                    <span className="text-violet-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={getPlanUrl(plan.planKey)}
                aria-disabled={status === "loading"}
                onClick={(event) => {
                  if (status === "loading") {
                    event.preventDefault();
                  }
                }}
                className={`block rounded-xl px-5 py-3 text-center font-semibold transition ${
                  plan.popular
                    ? "bg-violet-600 hover:bg-violet-500"
                    : "border border-white/15 hover:bg-white/10"
                }`}
              >
                {status === "loading"
                  ? "Checking account..."
                  : session?.user
                    ? "Subscribe Now"
                    : "Get Started"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
