import Link from "next/link";

const plans = [
  { name: "Free", price: "$0", credits: "5 credits/month", priceId: null, featured: false },
  { name: "Basic", price: "$9.99", credits: "100 credits/month", priceId: "price_basic", featured: true },
  { name: "Pro", price: "$24.99", credits: "500 credits/month", priceId: "price_pro", featured: false },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
        Simple, Transparent Pricing
      </h1>
      <p className="mx-auto mt-2 max-w-lg text-center text-zinc-600 dark:text-zinc-400">
        Start free. Upgrade when you need more.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl p-6 ${
              plan.featured
                ? "border-2 border-blue-600 bg-white shadow-sm dark:border-blue-500 dark:bg-zinc-900"
                : "border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            }`}
          >
            {plan.featured && (
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                Popular
              </span>
            )}
            <h2 className={`mt-2 text-xl font-semibold ${plan.featured ? "" : ""} text-zinc-900 dark:text-white`}>
              {plan.name}
            </h2>
            <p className="mt-2 text-4xl font-bold text-zinc-900 dark:text-white">{plan.price}</p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{plan.credits}</p>
            <ul className="mt-6 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>✓ All AI tools included</li>
              <li>✓ Files deleted after 1 hour</li>
              <li>✓ No watermark on outputs</li>
            </ul>
            <Link
              href="/signup"
              className={`mt-6 block w-full rounded-lg px-4 py-2.5 text-center text-sm font-medium ${
                plan.featured
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "border border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {plan.price === "$0" ? "Get Started" : "Subscribe"}
            </Link>
          </div>
        ))}
      </div>

      {/* Per-credit pricing */}
      <div className="mt-12 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Pay-as-you-go</h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">No subscription? Buy credits anytime.</p>
        <div className="mt-4 flex items-center gap-4">
          <span className="text-2xl font-bold text-zinc-900 dark:text-white">$4.99</span>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">50 credits</span>
        </div>
      </div>

      {/* Cost per tool */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Cost per Tool</h3>
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-start font-medium text-zinc-500 dark:text-zinc-400">Tool</th>
                <th className="px-4 py-3 text-end font-medium text-zinc-500 dark:text-zinc-400">Credits</th>
                <th className="px-4 py-3 text-end font-medium text-zinc-500 dark:text-zinc-400">Cost</th>
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
    </div>
  );
}
