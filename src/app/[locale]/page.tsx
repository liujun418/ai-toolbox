import Link from "next/link";
import { getDictionary } from "@/lib/i18n";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as any);
  const t = dict as any;
  const home = t.home || {};
  const tools = t.tools || {};
  const features = t.features || [];
  const faqs = t.faqs || [];
  const pricing = t.pricing || {};

  const toolList = [
    { id: "avatar-generator", name: tools["avatar-generator"]?.name || "AI Avatar Generator", description: tools["avatar-generator"]?.description || "", icon: "🎨", credits: 5, href: `/${locale}/tools/avatar-generator`, badge: t.home?.popular || "Popular" },
    { id: "background-remover", name: tools["background-remover"]?.name || "Background Remover", description: tools["background-remover"]?.description || "", icon: "✂️", credits: 2, href: `/${locale}/tools/background-remover`, badge: t.home?.free || "Free" },
    { id: "watermark-remover", name: tools["watermark-remover"]?.name || "Watermark Remover", description: tools["watermark-remover"]?.description || "", icon: "🧹", credits: 3, href: `/${locale}/tools/watermark-remover`, badge: null },
    { id: "photo-restorer", name: tools["photo-restorer"]?.name || "Photo Restorer", description: tools["photo-restorer"]?.description || "", icon: "📷", credits: 5, href: `/${locale}/tools/photo-restorer`, badge: null },
    { id: "pdf-to-word", name: tools["pdf-to-word"]?.name || "PDF to Word", description: tools["pdf-to-word"]?.description || "", icon: "📄", credits: 1, href: `/${locale}/tools/pdf-to-word`, badge: null },
    { id: "image-upscaler", name: tools["image-upscaler"]?.name || "Image Upscaler", description: tools["image-upscaler"]?.description || "", icon: "🔍", credits: 2, href: `/${locale}/tools/image-upscaler`, badge: t.home?.new || "New" },
    { id: "style-transfer", name: tools["style-transfer"]?.name || "Image Style Transfer", description: tools["style-transfer"]?.description || "", icon: "🖼️", credits: 4, href: `/${locale}/tools/style-transfer`, badge: t.home?.new || "New" },
    { id: "text-polish", name: tools["text-polish"]?.name || "Text Polish & Rewrite", description: tools["text-polish"]?.description || "", icon: "✨", credits: 3, href: `/${locale}/tools/text-polish`, badge: t.home?.new || "New" },
  ];

  const creditsLabel = (credits: number) => credits === 0 ? (t.home?.free || "Free") : `${credits} ${t.home?.credits || "credits"}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
          {home.heroTitle || "Free AI Tools for"}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{home.heroTitleHighlight || " Every"}</span> Task
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          {home.heroDescription || "Remove backgrounds, generate avatars, restore old photos, convert PDFs — all powered by AI, all in your browser."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href={`/${locale}/signup`}
            className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {home.getFreeCredits || "Get 5 Free Credits"}
          </Link>
          <Link
            href={`/${locale}/pricing`}
            className="rounded-xl border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {home.viewPricing || "View Pricing"}
          </Link>
        </div>
      </section>

      {/* Tools Grid */}
      <section>
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {home.allTools || "All Tools"}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {toolList.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              {tool.badge && (
                <span
                  className={`absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    tool.badge === (t.home?.popular || "Popular")
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                      : tool.badge === (t.home?.free || "Free")
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
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
                  {creditsLabel(tool.credits)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mt-16">
        <h2 className="mb-2 text-center text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {home.whyChooseTitle || "Why Choose AI ToolBox Online?"}
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-center text-zinc-500 dark:text-zinc-400">
          {home.whyChooseSubtitle || "Powerful AI tools built for speed, quality, and privacy."}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature: any, i: number) => (
            <div
              key={feature.title || i}
              className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="text-3xl">{feature.icon}</span>
              <h3 className="mt-3 font-semibold text-zinc-900 dark:text-white">{feature.title}</h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {home.pricingTitle || "Simple, Transparent Pricing"}
        </h2>
        <p className="mb-8 text-zinc-500 dark:text-zinc-400">
          {home.pricingSubtitle || "Start free. Upgrade when you need more. No hidden fees."}
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { name: "Free", price: "$0", desc: "5 credits/month", cta: home.getFreeCredits || "Get Started", href: `/${locale}/signup`, popular: false },
            { name: "Basic", price: "$9.99", desc: "100 credits", cta: home.viewPricing || "View Plans", href: `/${locale}/pricing`, popular: true },
            { name: "Pro", price: "$24.99", desc: "500 credits", cta: home.viewPricing || "View Plans", href: `/${locale}/pricing`, popular: false },
          ].map((plan) => (
            <div key={plan.name} className={`rounded-2xl ${plan.popular ? "border-2 border-blue-600 bg-white p-6 shadow-sm dark:border-blue-500 dark:bg-zinc-900" : "border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"}`}>
              {plan.popular && <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{t.home?.popular || "Popular"}</span>}
              <h3 className={`text-lg font-semibold text-zinc-900 dark:text-white ${plan.popular ? "mt-2" : ""}`}>{plan.name}</h3>
              <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-white">{plan.price}</p>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{plan.desc}</p>
              <Link href={plan.href} className={`mt-4 block w-full rounded-lg px-4 py-2 text-center text-sm font-medium ${plan.popular ? "bg-blue-600 text-white hover:bg-blue-700" : "border border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mt-16">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {home.howItWorks || "How It Works"}
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { step: "1", title: home.upload || "Upload", desc: home.uploadDesc || "Upload your file — image or PDF." },
            { step: "2", title: home.process || "Process", desc: home.processDesc || "Our AI models process your file instantly." },
            { step: "3", title: home.download || "Download", desc: home.downloadDesc || "Get your result and download it." },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-lg font-bold text-white dark:bg-white dark:text-zinc-900">
                {item.step}
              </div>
              <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-16 max-w-3xl">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {home.faqTitle || "Frequently Asked Questions"}
        </h2>
        <div className="space-y-4">
          {faqs.map((item: any, i: number) => (
            <details
              key={item.q || i}
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

      {/* CTA */}
      <section className="mt-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {home.ctaTitle || "Ready to Get Started?"}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-white/80">
          {home.ctaSubtitle || "Sign up today and get 5 free credits — no credit card required."}
        </p>
        <Link
          href={`/${locale}/signup`}
          className="mt-6 inline-block rounded-lg bg-white px-8 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-colors hover:bg-zinc-100"
        >
          {home.ctaButton || "Create Free Account"}
        </Link>
      </section>
    </div>
  );
}
