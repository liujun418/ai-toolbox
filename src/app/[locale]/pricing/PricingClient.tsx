"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { toolsApi } from "@/lib/api";
import { getLocaleFromPathname } from "@/lib/locale";

const packages = [
  { id: "50_credits", credits: 50, price: "$4.99", popular: false },
  { id: "100_credits", credits: 100, price: "$9.99", popular: true },
  { id: "500_credits", credits: 500, price: "$24.99", popular: false },
];

export default function PricingClient() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const [error, setError] = useState("");

  async function handlePurchase(packageId: string) {
    if (!user) {
      router.push(`/${locale}/signup`);
      return;
    }

    try {
      const { checkout_url } = await toolsApi.createCheckoutSession(packageId);
      window.location.assign(checkout_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
          <button onClick={() => setError("")} className="ml-3 font-medium underline hover:no-underline">Dismiss</button>
        </div>
      )}
      <h1 className="text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
        Simple, Transparent Pricing
      </h1>
      <p className="mx-auto mt-2 max-w-2xl text-center text-zinc-600 dark:text-zinc-400">
        AI ToolBox Online offers AI-powered image processing and document conversion tools.
        You purchase credits to use these tools — each tool costs a set number of credits per use.
        All prices in USD. No hidden fees.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`rounded-2xl p-6 ${
              pkg.popular
                ? "border-2 border-blue-600 bg-white shadow-sm dark:border-blue-500 dark:bg-zinc-900"
                : "border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            }`}
          >
            {pkg.popular && (
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                Popular
              </span>
            )}
            <h2 className="mt-2 text-xl font-semibold text-zinc-900 dark:text-white">
              {pkg.credits} Credits
            </h2>
            <p className="mt-2 text-4xl font-bold text-zinc-900 dark:text-white">{pkg.price}</p>
            <ul className="mt-6 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>✓ All AI tools included</li>
              <li>✓ Files deleted after 1 hour</li>
              <li>✓ No watermark on outputs</li>
            </ul>
            <button
              onClick={() => handlePurchase(pkg.id)}
              className={`mt-6 block w-full rounded-lg px-4 py-2.5 text-center text-sm font-medium ${
                pkg.popular
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "border border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {pkg.credits === 50 ? "Get Started" : "Subscribe"}
            </button>
          </div>
        ))}
      </div>

      {/* Cost per tool */}
      <div className="mt-12">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Cost per Tool</h3>
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-start font-medium text-zinc-500 dark:text-zinc-400">Tool</th>
                <th className="px-4 py-3 text-end font-medium text-zinc-500 dark:text-zinc-400">Credits</th>
                <th className="px-4 py-3 text-end font-medium text-zinc-500 dark:text-zinc-400">USD Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {[
                ["Background Remover", "2", "$0.20"],
                ["Watermark Remover", "3", "$0.30"],
                ["AI Avatar Generator", "5", "$0.50"],
                ["Photo Restorer", "5", "$0.50"],
                ["PDF to Word (≤10 pages)", "1", "$0.10"],
                ["PDF to Word (>10 pages)", "2", "$0.20"],
                ["Image Upscaler", "2", "$0.20"],
                ["Image Style Transfer", "4", "$0.40"],
                ["Text Polish & Rewrite", "3", "$0.30"],
              ].map(([tool, credits, cost]) => (
                <tr key={tool}>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{tool}</td>
                  <td className="px-4 py-3 text-end text-zinc-500 dark:text-zinc-400">{credits}</td>
                  <td className="px-4 py-3 text-end text-zinc-500 dark:text-zinc-400">{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Important Information */}
      <div className="mt-12 space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Important Information</h3>

        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white">What Are Credits?</h4>
            <p className="mt-1">
              Credits are a virtual currency used within AI ToolBox Online to access our AI tools.
              Each tool use deducts a set number of credits from your account balance.
              Credit costs are shown before each use so there are no surprises.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white">Credit Expiration</h4>
            <p className="mt-1">
              Free tier credits (5 per month) reset at the start of each calendar month and do not roll over.
              Purchased credits are valid for 12 months from the date of purchase.
              Unused purchased credits expire after 12 months unless otherwise stated.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white">Refund Policy</h4>
            <p className="mt-1">
              Credits are non-refundable and non-transferable once purchased.
              If you experience a technical issue (e.g., tool failure, error during processing),
              contact us at <a href="mailto:jzerov@live.com" className="text-blue-600 hover:underline">jzerov@live.com</a> with details and we will investigate.
              We will refund credits to your account if the issue was caused by our service.
              Refund requests are processed within 5 business days.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white">Usage Restrictions</h4>
            <p className="mt-1">
              Credits are for personal use only and cannot be resold, shared, or transferred to another account.
              Automated access, scraping, or misuse of our tools may result in account suspension.
              Uploaded files are automatically deleted within 1 hour of processing.
            </p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <p>Questions about pricing? Contact us at <a href="mailto:jzerov@live.com" className="text-blue-600 hover:underline">jzerov@live.com</a></p>
        <p className="mt-1">Read our <a href={`/${locale}/terms`} className="text-blue-600 hover:underline">Terms of Service</a> and <a href={`/${locale}/privacy`} className="text-blue-600 hover:underline">Privacy Policy</a>.</p>
      </div>
    </div>
  );
}
