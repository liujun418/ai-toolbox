import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import ToolsGrid from "@/components/ToolsGrid";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as any);
  const t = dict as any;
  const home = t.home || {};
  const features = t.features || [];
  const faqs = t.faqs || [];
  const pricing = t.pricing || {};

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Hero Banner */}
      <section className="mb-12 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-6 py-16 text-center sm:px-12 sm:py-20">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
          {home.heroTitle || "AI-Powered Tools for Images & Content"}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-400 sm:text-lg">
          {home.heroSubtitle || "Generate, edit, and transform images with AI. Create articles, convert text to speech, and more. Free to start — no credit card needed."}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={`/${locale}/ai-image-editing`}
            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-lg transition-all hover:bg-zinc-100 active:scale-95"
          >
            🎨 {home.heroImageEditing || "Edit Images"}
          </Link>
          <Link
            href={`/${locale}/ai-content-creation`}
            className="rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/20 transition-all hover:bg-white/20 active:scale-95"
          >
            📝 {home.heroContentCreation || "Create Content"}
          </Link>
          <Link
            href={`/${locale}/signup`}
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95"
          >
            {home.heroSignup || "Get 5 Free Credits"}
          </Link>
        </div>
        <p className="mt-6 text-xs text-zinc-500">
          {home.heroHint || "No credit card · 15 AI tools · Pay only for what you use"}
        </p>
      </section>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "AI ToolBox Online",
            url: "https://ai.toolboxonline.club",
            description: "AI-powered online tools for image generation, editing, content creation, and documents. Free to start, pay-as-you-go.",
            potentialAction: {
              "@type": "SearchAction",
              target: `https://ai.toolboxonline.club/${locale}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "AI ToolBox Online",
            url: "https://ai.toolboxonline.club",
            sameAs: ["https://toolboxonline.club"],
          }),
        }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((item: any) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            }),
          }}
        />
      )}

      {/* Tools Grid with Category Filter */}
      <ToolsGrid locale={locale} dict={dict} />

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
          {home.pricingSubtitle || "Start free. Pay-as-you-go. No subscription lock-in."}
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { name: "Free", price: "$0", desc: "5 free credits", cta: home.getFreeCredits || "Get Started", href: `/${locale}/signup`, popular: false },
            { name: "Standard", price: "$10", desc: "50 credits", cta: home.viewPricing || "View Plans", href: `/${locale}/pricing`, popular: true },
            { name: "Value", price: "$25", desc: "200 credits", cta: home.viewPricing || "View Plans", href: `/${locale}/pricing`, popular: false },
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
