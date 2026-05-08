"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    try {
      const res = await authApi.login({ email, password });
      authApi.setToken(res.access_token);
      await refresh();
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Log in</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Sign in to access your AI tools and credits.</p>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
          <input type="email" id="email" name="email" required className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
          <input type="password" id="password" name="password" required minLength={6} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" placeholder="••••••••" />
        </div>
        <button type="submit" disabled={loading} className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900">
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Don't have an account?{" "}
        <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">Sign up</Link>
      </p>
    </div>
  );
}
