"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { toolsApi } from "@/lib/api";
import { getLocaleFromPathname } from "@/lib/locale";
import { tools } from "@/lib/tools";
import { getCreditCost } from "@/lib/creditCosts";

const CONTACT_EMAIL = "jzerov@live.com";

const oneTimePacks = [
  { id: "small_credits", credits: 10, price: "$3.00", popular: false },
  { id: "standard_credits", credits: 50, price: "$10.00", popular: true },
  { id: "value_credits", credits: 200, price: "$25.00", popular: false },
];

const subscriptionTiers = [
  { id: "basic_monthly", credits: 40, price: "$8", popular: false },
  { id: "pro_monthly", credits: 120, price: "$18", popular: true },
];

export default function PricingClient({ dict }: { dict?: Record<string, unknown> }) {
  const p = (dict as any)?.pricing || {};
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const [error, setError] = useState("");

  async function handlePurchase(packageId: string) {
    if (!user) { router.push(`/${locale}/signup`); return; }
    try {
      const isSub = packageId.endsWith("_monthly");
      const fn = isSub ? toolsApi.createSubscriptionSession : toolsApi.createCheckoutSession;
      const { checkout_url } = await fn(packageId);
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
        Simple Pricing: Pay-as-You-Go
      </h1>
      <p className="mx-auto mt-2 max-w-2xl text-center text-zinc-600 dark:text-zinc-400">
        Buy credits when you need them. No subscription lock-in. All prices in USD.
      </p>

      {/* One-Time Credit Packs */}
      <h2 className="mt-12 mb-4 text-center text-xl font-bold text-zinc-900 dark:text-white">
        One-Time Credit Packs
      </h2>
      <p className="mx-auto mb-6 max-w-xl text-center text-sm text-zinc-500 dark:text-zinc-400">
        Buy credits that are valid for 12 months. Use them on any tool, anytime.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {oneTimePacks.map((pkg) => (
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
            <h3 className="mt-2 text-xl font-semibold text-zinc-900 dark:text-white">
              {pkg.credits} Credits
            </h3>
            <p className="mt-2 text-4xl font-bold text-zinc-900 dark:text-white">{pkg.price}</p>
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              ${(parseFloat(pkg.price.replace("$", "")) / pkg.credits).toFixed(2)}/credit
            </p>
            <ul className="mt-6 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>✓ All AI tools included</li>
              <li>✓ Valid for 12 months</li>
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
              Get {pkg.credits} Credits
            </button>
          </div>
        ))}
      </div>

      {/* Why Pay-as-You-Go */}
      <div className="mt-10 rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950/20">
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
          Why Pay-as-You-Go?
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-green-700 dark:text-green-400">
          <li>• No monthly subscription lock-in. Buy credits only when you need them.</li>
          <li>• Purchased credits are valid for 12 months — no rush to use them.</li>
          <li>• Each credit is worth the same across all tools. Full price transparency.</li>
        </ul>
      </div>

      {/* Subscription Tiers */}
      <h2 className="mt-12 mb-4 text-center text-xl font-bold text-zinc-900 dark:text-white">
        {p.subscriptionTitle || "Monthly Subscriptions"}
      </h2>
      <p className="mx-auto mb-6 max-w-xl text-center text-sm text-zinc-500 dark:text-zinc-400">
        {p.subscriptionDesc || "Get fresh credits every month, capped at your plan limit."}
      </p>
      <div className="mx-auto grid max-w-md gap-4 sm:max-w-none sm:grid-cols-2">
        {subscriptionTiers.map((tier) => (
          <div
            key={tier.id}
            className={`rounded-2xl p-6 ${
              tier.popular
                ? "border-2 border-purple-600 bg-white shadow-sm dark:border-purple-500 dark:bg-zinc-900"
                : "border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            }`}
          >
            {tier.popular && (
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                Popular
              </span>
            )}
            <h3 className="mt-2 text-xl font-semibold text-zinc-900 dark:text-white">
              {tier.credits} Credits/mo
            </h3>
            <p className="mt-2 text-4xl font-bold text-zinc-900 dark:text-white">
              {tier.price}<span className="text-base font-normal text-zinc-400">/month</span>
            </p>
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              ${(parseFloat(tier.price.replace("$", "")) / tier.credits).toFixed(2)}/credit
            </p>
            <ul className="mt-6 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>✓ {tier.credits} credits/month (hard cap)</li>
              <li>✓ All AI tools included</li>
              <li>✓ Cancel anytime</li>
              <li>⚠ Unused credits do not roll over</li>
            </ul>
            <button
              onClick={() => handlePurchase(tier.id)}
              className={`mt-6 block w-full rounded-lg px-4 py-2.5 text-center text-sm font-medium ${
                tier.popular
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "border border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>

      {/* Cost per Tool */}
      <div className="mt-12">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">{p.costPerTool || "Cost per Tool"}</h3>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-[400px] text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-start font-medium text-zinc-500 dark:text-zinc-400">Tool</th>
                <th className="px-4 py-3 text-end font-medium text-zinc-500 dark:text-zinc-400">Credits</th>
                <th className="px-4 py-3 text-end font-medium text-zinc-500 dark:text-zinc-400">USD Cost*</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {tools.filter(t => !t.free).map((tool) => {
                const cost = getCreditCost(tool.id);
                return (
                  <tr key={tool.id}>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{tool.icon} {tool.name}</td>
                    <td className="px-4 py-3 text-end text-zinc-500 dark:text-zinc-400">
                      {cost > 0 ? `${cost}` : "Free"}
                    </td>
                    <td className="px-4 py-3 text-end text-zinc-500 dark:text-zinc-400">
                      {cost > 0 ? `$${(cost * 0.10).toFixed(2)}` : "Free"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
          * Based on Standard Pack ($10/50 credits = $0.20/credit). Free tools require login.
        </p>
      </div>

      {/* Important Information */}
      <div className="mt-12 space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{p.importantInfo || "Important Information"}</h3>
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white">{p.whatAreCredits || "What Are Credits?"}</h4>
            <p className="mt-1">{p.whatAreCreditsDesc || "Credits are a virtual currency used to access our AI tools."}</p>
          </div>
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white">{p.expiration || "Credit Expiration"}</h4>
            <p className="mt-1">{p.expirationDesc || "Purchased credits are valid for 12 months."}</p>
          </div>
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white">{p.refund || "Refund Policy"}</h4>
            <p className="mt-1">{p.refundDesc || "Credits are non-refundable once purchased."} <>{p.refundDesc ? "" : "If you experience a technical issue, contact us at "}<a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 hover:underline">{CONTACT_EMAIL}</a>{p.refundDesc ? "" : " for investigation."}</></p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <p>Questions about pricing? Contact us at <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 hover:underline">{CONTACT_EMAIL}</a></p>
        <p className="mt-1">{(p as any).readOur || "Read our"} <a href={`/${locale}/terms`} className="text-blue-600 hover:underline">{(p as any).termsOfService || "Terms of Service"}</a> {(p as any).and || "and"} <a href={`/${locale}/privacy`} className="text-blue-600 hover:underline">{(p as any).privacyPolicy || "Privacy Policy"}</a>.</p>
      </div>
    </div>
  );
}
