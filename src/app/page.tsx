import Link from "next/link";

const tools = [
  {
    id: "avatar-generator",
    name: "AI Avatar Generator",
    description: "Transform your photos into cartoon, anime, or professional avatars.",
    icon: "🎨",
    credits: 5,
    href: "/tools/avatar-generator",
    badge: "Popular",
  },
  {
    id: "background-remover",
    name: "Background Remover",
    description: "Remove image backgrounds instantly with one click.",
    icon: "✂️",
    credits: 2,
    href: "/tools/background-remover",
    badge: "Free",
  },
  {
    id: "watermark-remover",
    name: "Watermark Remover",
    description: "Erase watermarks, logos, and text from images intelligently.",
    icon: "🧹",
    credits: 3,
    href: "/tools/watermark-remover",
    badge: null,
  },
  {
    id: "photo-restorer",
    name: "Photo Restorer",
    description: "Restore and colorize old, blurry, or damaged photos.",
    icon: "📷",
    credits: 5,
    href: "/tools/photo-restorer",
    badge: null,
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    description: "Convert PDF documents to editable Word files instantly.",
    icon: "📄",
    credits: 1,
    href: "/tools/pdf-to-word",
    badge: null,
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
          Free AI Tools for
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Every</span> Task
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Remove backgrounds, generate avatars, restore old photos, convert PDFs — all powered by AI, all in your browser.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Get 5 Free Credits
          </Link>
          <Link
            href="/pricing"
            className="rounded-xl border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            View Pricing
          </Link>
        </div>
      </section>

      {/* Tools Grid */}
      <section>
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          All Tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              {tool.badge && (
                <span
                  className={`absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    tool.badge === "Popular"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                      : tool.badge === "Free"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {tool.badge}
                </span>
              )}
              <span className="mb-3 block text-3xl">{tool.icon}</span>
              <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                {tool.name}
              </h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {tool.description}
              </p>
              <div className="mt-4 flex items-center text-xs font-medium text-zinc-400 dark:text-zinc-500">
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">
                  {tool.credits === 0 ? "Free" : `${tool.credits} credits`}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Simple, Transparent Pricing
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Free</h3>
            <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-white">$0</p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">5 credits/month</p>
            <Link
              href="/signup"
              className="mt-4 block w-full rounded-lg border border-zinc-300 px-4 py-2 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Get Started
            </Link>
          </div>
          <div className="rounded-2xl border-2 border-blue-600 bg-white p-6 shadow-sm dark:border-blue-500 dark:bg-zinc-900">
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              Popular
            </span>
            <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-white">Basic</h3>
            <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-white">$9.99</p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">100 credits/month</p>
            <Link
              href="/pricing"
              className="mt-4 block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
            >
              Subscribe
            </Link>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Pro</h3>
            <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-white">$24.99</p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">500 credits/month</p>
            <Link
              href="/pricing"
              className="mt-4 block w-full rounded-lg border border-zinc-300 px-4 py-2 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-16 max-w-3xl">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "What can I do with free credits?",
              a: "You get 5 free credits every month. That's enough to remove 2 backgrounds, convert 5 PDFs, or generate 1 avatar.",
            },
            {
              q: "Do unused credits roll over?",
              a: "Free tier credits reset monthly. Paid plan credits refresh with your billing cycle.",
            },
            {
              q: "Is my data safe?",
              a: "All uploaded files are automatically deleted from our servers after 1 hour. We never store or share your images.",
            },
            {
              q: "What AI models do you use?",
              a: "We use industry-leading models via Replicate API, including Stable Diffusion for image generation and GFPGAN for photo restoration.",
            },
          ].map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-zinc-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <summary className="cursor-pointer list-none text-sm font-medium text-zinc-900 dark:text-white">
                {item.q}
                <span className="ms-auto inline-block transition-transform group-open:rotate-180">
                  <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
