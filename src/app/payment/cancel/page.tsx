"use client";

import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
      <div className="mb-6 text-6xl">❌</div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Payment Cancelled</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        Your payment was not completed. No charges have been made.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/pricing"
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Try Again
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
