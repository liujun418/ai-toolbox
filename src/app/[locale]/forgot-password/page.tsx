"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { authApi } from "@/lib/api";
import { getLocaleFromPathname } from "@/lib/locale";

export default function ForgotPasswordPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
        Forgot Password
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Enter your email and we'll send a reset link.
      </p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {sent ? (
        <div className="mt-8 space-y-4">
          <p className="text-sm text-green-600 dark:text-green-400">
            Check your email for the password reset link.
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Didn't receive it?{" "}
            <button onClick={() => setSent(false)} className="font-medium text-blue-600 hover:text-blue-500">
              Try again
            </button>
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}

      <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <Link href={`/${locale}/login`} className="font-medium text-blue-600 hover:text-blue-500">
          Back to Login
        </Link>
      </p>
    </div>
  );
}
