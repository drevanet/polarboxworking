
// app/signup-phone/page.tsx

"use client";

import {
  FormEvent,
  Suspense,
  useState,
} from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

const EXTERNAL_REDIRECT_URL = "https://buy.polar.sh/polar_cl_WAW7IlyHkL0r6DMosXxRwtiYmPvlAJ7MC8kSf0NupKE";

function SignupPhoneForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Register using the existing signup API.
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not create account.");
        return;
      }

      // Automatically sign in using the existing credentials provider.
      const auth = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password: phone,
        redirect: false,
      });

      if (auth?.error || !auth?.ok) {
        window.location.assign("/login?registered=1");
        return;
      }

      // Redirect to your external website after successful signup.
      window.location.assign(EXTERNAL_REDIRECT_URL);
    } catch (err) {
      console.error("Signup error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 px-5 py-14 text-white">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-gray-900 p-8 shadow-2xl sm:p-12">
        <Link href="/" className="text-xl font-black italic">
          BETI<span className="text-red-500">SPORTS</span>
        </Link>

        <h1 className="mt-8 text-3xl font-black">
          Create your Betisports account
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Create your account to get started.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium"
            >
              Full name
            </label>

            <input
              className="w-full rounded-xl border border-white/10 bg-gray-800 px-4 py-3 outline-none focus:border-red-500"
              id="name"
              type="text"
              required
              maxLength={100}
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Email address
            </label>

            <input
              className="w-full rounded-xl border border-white/10 bg-gray-800 px-4 py-3 outline-none focus:border-red-500"
              id="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium"
            >
              Phone number
            </label>

            <input
              className="w-full rounded-xl border border-white/10 bg-gray-800 px-4 py-3 outline-none focus:border-red-500"
              id="phone"
              type="tel"
              inputMode="tel"
              required
              maxLength={72}
              autoComplete="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <p className="mt-2 text-xs text-gray-500">
              Enter at least 8 characters to match your existing
              signup validation.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-red-600 px-5 py-3.5 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already registered?{" "}
          <Link
            href="/login"
            className="font-semibold text-red-400 hover:underline"
          >
            Sign in
          </Link>
        </p>

        <p className="mt-5 text-center text-xs text-gray-500">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>.
        </p>
      </div>
    </main>
  );
}

export default function SignupPhonePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950" />}>
      <SignupPhoneForm />
    </Suspense>
  );
}
