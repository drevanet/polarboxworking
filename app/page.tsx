
"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  Box,
  Check,
  ChevronDown,
  Download,
  Layers3,
  Palette,
  ShieldCheck,
  Sparkles,
  Upload,
  WandSparkles,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Box,
    title: "Realistic 3D previews",
    description:
      "Preview your packaging in a beautiful interactive 3D environment before downloading your design.",
  },
  {
    icon: Layers3,
    title: "Six editable faces",
    description:
      "Customize the front, back, left, right, top, and bottom of your box independently.",
  },
  {
    icon: Upload,
    title: "Your own artwork",
    description:
      "Upload images to individual faces and create packaging that reflects your brand.",
  },
  {
    icon: Download,
    title: "PNG downloads",
    description:
      "Export your box mockups as PNG images for presentations, product pages, and design reviews.",
  },
  {
    icon: Palette,
    title: "Creative freedom",
    description:
      "Experiment with colors, artwork, and layouts to find the look that works for your product.",
  },
  {
    icon: Zap,
    title: "A faster workflow",
    description:
      "Create packaging mockups in your browser without learning complicated 3D software.",
  },
];

const steps = [
  {
    number: "01",
    title: "Open your workspace",
    description:
      "Create your account or sign in to access the Reva Box editor.",
  },
  {
    number: "02",
    title: "Customize your box",
    description:
      "Upload artwork to each face and rotate the 3D model to inspect your design.",
  },
  {
    number: "03",
    title: "Download your mockup",
    description:
      "Export your finished box as a PNG and use it in your creative projects.",
  },
];

const faqs = [
  {
    question: "What is Reva Box?",
    answer:
      "Reva Box is a browser-based tool for creating and previewing 3D box packaging mockups. You can customize the six faces of a box and download a PNG preview.",
  },
  {
    question: "Can I upload different images to each face?",
    answer:
      "Yes. The editor is designed to let you upload artwork separately for the front, back, left, right, top, and bottom faces.",
  },
  {
    question: "Do I need 3D design experience?",
    answer:
      "No. Reva Box is designed to make creating packaging previews more accessible through a visual, browser-based editor.",
  },
  {
    question: "What do the subscription plans include?",
    answer:
      "The monthly plan includes 50 project downloads. The biweekly and yearly plans include unlimited downloads while the subscription is active.",
  },
  {
    question: "Can I use Reva Box on my laptop?",
    answer:
      "Yes. You can use Reva Box in a modern browser on a compatible desktop or laptop computer.",
  },
];

export default function HomePage() {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isSignedIn = Boolean(session?.user);

  // Signed-in users should go straight to the editor.
  // New visitors should go to sign-up.
  const createBoxUrl = isSignedIn ? "/editor" : "/signup";

  return (
    <main className="min-h-screen overflow-hidden bg-[#080811] text-white">
      {/* Navigation */}
   

      {/* Hero */}
      <section className="relative px-6 pb-24 pt-20 md:pb-32 md:pt-28">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-700/15 blur-[140px]" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-200">
              <Sparkles className="h-4 w-4" />
              Packaging design, made simpler
            </div>

            <h1 className="max-w-2xl text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Turn your ideas into{" "}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                stunning 3D boxes.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-gray-400">
              Create beautiful packaging mockups in minutes. Upload your
              artwork, customize every side of your box, and preview your
              design in 3D without complicated software.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href={createBoxUrl}
                aria-disabled={isLoading}
                onClick={(event) => {
                  if (isLoading) event.preventDefault();
                }}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 font-semibold transition ${
                  isLoading
                    ? "cursor-not-allowed bg-violet-600/50"
                    : "bg-violet-600 shadow-xl shadow-violet-950/30 hover:-translate-y-0.5 hover:bg-violet-500"
                }`}
              >
                {isLoading
                  ? "Checking account..."
                  : isSignedIn
                    ? "Create Your First Box"
                    : "Create Your First Box"}

                {!isLoading && <ArrowRight className="h-5 w-5" />}
              </Link>

              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 px-7 py-4 font-semibold transition hover:bg-white/5"
              >
                Explore pricing
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-violet-400" />
                Six customizable faces
              </span>

              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-violet-400" />
                Interactive 3D preview
              </span>

              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-violet-400" />
                PNG export
              </span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute inset-8 rounded-full bg-violet-600/20 blur-[100px]" />

            <div className="relative rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6 shadow-2xl shadow-black/30 sm:p-10">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">YOUR NEXT PROJECT</p>
                  <h2 className="mt-1 text-lg font-semibold">
                    Premium packaging
                  </h2>
                </div>

                <span className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">
                  3D Preview
                </span>
              </div>

              <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-[#0d0d1b]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.18),transparent_65%)]" />

                <div className="relative h-48 w-48 [perspective:800px]">
                  <div className="absolute inset-0 rotate-[-12deg] [transform-style:preserve-3d]">
                    <div className="absolute inset-0 flex flex-col items-center justify-center border border-violet-200/30 bg-gradient-to-br from-violet-500 via-violet-700 to-indigo-950 shadow-2xl shadow-violet-950/50">
                      <Sparkles className="mb-3 h-9 w-9 text-violet-100" />

                      <span className="text-xl font-bold tracking-widest">
                        YOUR
                      </span>

                      <span className="text-xl font-bold tracking-widest">
                        BRAND
                      </span>

                      <span className="mt-3 text-[9px] tracking-[0.3em] text-violet-200">
                        MADE TO STAND OUT
                      </span>
                    </div>

                    <div className="absolute -right-12 top-0 h-full w-12 origin-left skew-y-[-35deg] border border-violet-200/20 bg-gradient-to-b from-indigo-700 to-indigo-950" />

                    <div className="absolute -top-12 left-0 h-12 w-full origin-bottom skew-x-[-55deg] border border-violet-200/20 bg-gradient-to-r from-violet-300 to-indigo-400" />
                  </div>
                </div>

                <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 backdrop-blur">
                  <WandSparkles className="h-4 w-4 text-violet-300" />

                  <span className="text-xs text-gray-300">
                    Made for your brand
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { label: "Editable faces", value: "06" },
                  { label: "Export format", value: "PNG" },
                  { label: "Workflow", value: "Simple" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-center"
                  >
                    <p className="text-lg font-bold">{item.value}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -left-4 top-24 hidden rounded-xl border border-white/10 bg-[#151324] p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/15">
                  <Layers3 className="h-5 w-5 text-violet-300" />
                </span>

                <div>
                  <p className="text-sm font-semibold">Six faces</p>
                  <p className="text-xs text-gray-400">Your design, your way</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-3 bottom-20 hidden rounded-xl border border-white/10 bg-[#151324] p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15">
                  <Download className="h-5 w-5 text-emerald-300" />
                </span>

                <div>
                  <p className="text-sm font-semibold">PNG export</p>
                  <p className="text-xs text-gray-400">Ready to share</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits strip */}
      <section className="border-y border-white/10 bg-white/[0.02] px-6 py-8">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-3">
          {[
            {
              title: "Designed for creators",
              description: "A practical workflow for packaging concepts.",
            },
            {
              title: "Made for your brand",
              description: "Use your own artwork on every box face.",
            },
            {
              title: "Built for simplicity",
              description: "Create and preview designs in your browser.",
            },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <p className="font-semibold">{item.title}</p>
              <p className="mt-2 text-sm text-gray-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">
              Everything you need
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Your packaging vision, brought to life.
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-400">
              Go from a simple idea to a polished packaging preview with
              tools designed to keep your creative process moving.
            </p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="group rounded-2xl border border-white/10 bg-white/[0.025] p-7 transition hover:-translate-y-1 hover:border-violet-400/30 hover:bg-violet-400/[0.04]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10">
                    <Icon className="h-6 w-6 text-violet-300" />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-gray-400">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-y border-white/10 bg-white/[0.02] px-6 py-24 md:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">
              A simple process
            </p>

            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
              From idea to 3D mockup in three steps.
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-400">
              Spend less time navigating complicated tools and more time
              refining your packaging concept.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <article
                key={step.number}
                className="relative rounded-2xl border border-white/10 bg-[#0b0b16] p-8"
              >
                <span className="text-5xl font-bold text-violet-400/40">
                  {step.number}
                </span>

                <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>

                <p className="mt-4 leading-7 text-gray-400">
                  {step.description}
                </p>

                {index < steps.length - 1 && (
                  <ArrowRight className="absolute -right-5 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-violet-400 md:block" />
                )}
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href={createBoxUrl}
              aria-disabled={isLoading}
              onClick={(event) => {
                if (isLoading) event.preventDefault();
              }}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 font-semibold transition ${
                isLoading
                  ? "cursor-not-allowed bg-violet-600/50"
                  : "bg-violet-600 hover:bg-violet-500"
              }`}
            >
              {isLoading
                ? "Checking account..."
                : "Create Your First Box"}

              {!isLoading && <ArrowRight className="h-5 w-5" />}
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing highlights */}
      <section id="pricing" className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">
              Simple pricing
            </p>

            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
              Choose the plan that fits your workflow.
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-400">
              Pick a subscription based on how often you create and download
              your packaging mockups.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Biweekly",
                price: "$7",
                period: "every 2 weeks",
                detail: "Unlimited downloads",
                plan: "biweekly",
                featured: false,
              },
              {
                name: "Monthly",
                price: "$10",
                period: "per month",
                detail: "50 project downloads",
                plan: "monthly",
                featured: true,
              },
              {
                name: "Yearly",
                price: "$98",
                period: "per year",
                detail: "Unlimited downloads",
                plan: "yearly",
                featured: false,
              },
            ].map((plan) => (
              <article
                key={plan.plan}
                className={`flex flex-col rounded-2xl border p-7 ${
                  plan.featured
                    ? "border-violet-500 bg-violet-500/[0.08]"
                    : "border-white/10 bg-white/[0.025]"
                }`}
              >
                <h3 className="text-xl font-semibold">{plan.name}</h3>

                <div className="mt-5">
                  <span className="text-4xl font-bold">{plan.price}</span>

                  <span className="ml-2 text-sm text-gray-400">
                    {plan.period}
                  </span>
                </div>

                <p className="mt-4 flex-1 text-gray-400">{plan.detail}</p>

                <Link
                  href={`/pricing#${plan.plan}`}
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition ${
                    plan.featured
                      ? "bg-violet-600 hover:bg-violet-500"
                      : "border border-white/15 hover:bg-white/5"
                  }`}
                >
                  View plan
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            See all plan details on our{" "}
            <Link
              href="/pricing"
              className="text-violet-300 underline underline-offset-4 hover:text-violet-200"
            >
              pricing page
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Trust */}
      <section className="px-6 pb-24">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/[0.12] to-transparent p-8 text-center sm:p-12">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10">
            <ShieldCheck className="h-7 w-7 text-violet-300" />
          </div>

          <h2 className="text-3xl font-bold sm:text-4xl">
            Your next great package starts here.
          </h2>

          <p className="max-w-2xl leading-7 text-gray-400">
            Bring your artwork, explore your ideas in 3D, and create
            packaging mockups that help communicate your vision.
          </p>

          <Link
            href={createBoxUrl}
            aria-disabled={isLoading}
            onClick={(event) => {
              if (isLoading) event.preventDefault();
            }}
            className={`mt-3 inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 font-semibold transition ${
              isLoading
                ? "cursor-not-allowed bg-violet-600/50"
                : "bg-violet-600 hover:bg-violet-500"
            }`}
          >
            {isLoading ? "Checking account..." : "Create Your First Box"}
            {!isLoading && <ArrowRight className="h-5 w-5" />}
          </Link>
        </div>
      </section>

      {/* FAQs */}
      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">
              Frequently asked questions
            </p>

            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
              Good questions. Clear answers.
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-white/10 bg-white/[0.025] p-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {faq.question}

                  <ChevronDown className="h-5 w-5 shrink-0 text-violet-300 transition group-open:rotate-180" />
                </summary>

                <p className="mt-4 max-w-3xl leading-7 text-gray-400">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
     
    </main>
  );
}
