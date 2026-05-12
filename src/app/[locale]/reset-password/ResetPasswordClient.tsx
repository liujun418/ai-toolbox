"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

export default function ResetPasswordClient({
  locale,
  dict,
  token,
}: {
  locale: string;
  dict: Record<string, unknown>;
  token: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const t = (dict as any).resetPassword || {};

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirm = (form.elements.namedItem("confirm") as HTMLInputElement).value;
    if (password !== confirm) {
      setError(t.passwordsDontMatch || "Passwords don't match");
      setLoading(false);
      return;
    }
    if (!token) {
      setError(t.missingToken || "Missing reset token");
      setLoading(false);
      return;
    }
    try {
      await authApi.resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {t.invalidTitle || "Invalid Link"}
        </h1>
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          {t.invalidDesc || "The reset link is missing or invalid. Please request a new one."}
        </p>
        <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <Link href={`/${locale}/forgot-password`} className="font-medium text-blue-600 hover:text-blue-500">
            {t.invalidLinkText || "Forgot Password"}
          </Link>
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {t.successTitle || "Password Reset"}
        </h1>
        <p className="mt-4 text-sm text-green-600 dark:text-green-400">
          {t.successDesc || "Your password has been reset successfully."}
        </p>
        <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <Link href={`/${locale}/login`} className="font-medium text-blue-600 hover:text-blue-500">
            {t.loginLink || "Log in with new password"}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
        {t.title || "Reset Password"}
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        {t.subtitle || "Enter your new password below."}
      </p>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t.newPassword || "New Password"}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            minLength={6}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            placeholder={t.passwordPlaceholder || "••••••••"}
          />
        </div>
        <div>
          <label htmlFor="confirm" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t.confirmPassword || "Confirm Password"}
          </label>
          <input
            type="password"
            id="confirm"
            name="confirm"
            required
            minLength={6}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            placeholder={t.passwordPlaceholder || "••••••••"}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900"
        >
          {loading ? (t.loading || "Resetting...") : (t.button || "Reset Password")}
        </button>
      </form>
    </div>
  );
}
