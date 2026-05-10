import { getDictionary, isValidLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = (dict as any).about || {};
  const tools = (dict as any).tools || {};

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">{t.title || "About AI ToolBox Online"}</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t.subtitle || "Our mission and story"}</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{t.mission || "Our Mission"}</h2>
          <p className="mt-2">{t.missionText}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{t.offer || "What We Offer"}</h2>
          <p className="mt-2">{t.offerIntro || "We provide AI-powered tools:"}</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {(t.offerItems || [
              `${tools["background-remover"]?.name || "Background Remover"} — One-click background removal for any image`,
              `${tools["avatar-generator"]?.name || "AI Avatar Generator"} — Transform photos into cartoon, anime, or professional avatars`,
              `${tools["watermark-remover"]?.name || "Watermark Remover"} — Erase watermarks, logos, and text from images`,
              `${tools["photo-restorer"]?.name || "Photo Restorer"} — Restore and colorize old, blurry, or damaged photos`,
              `${tools["pdf-to-word"]?.name || "PDF to Word"} — Convert PDF documents to editable Word files`,
            ]).map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{t.howItWorks || "How It Works"}</h2>
          <p className="mt-2">{t.howItWorksText}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{t.pricingPhilosophy || "Pricing Philosophy"}</h2>
          <p className="mt-2">{t.pricingText}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{t.contact || "Contact"}</h2>
          <p className="mt-2" dangerouslySetInnerHTML={{ __html: (t.contactText || 'Have questions or feedback? Reach us at <a href="mailto:jzerov@live.com" class="text-blue-600 hover:underline">jzerov@live.com</a>.').replace(/class="/g, 'className="') }} />
        </section>
      </div>
    </div>
  );
}
