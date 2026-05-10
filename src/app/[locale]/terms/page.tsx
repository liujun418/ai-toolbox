import { getDictionary, isValidLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = (dict as any).terms || {};

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">{t.title || "Terms of Service"}</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t.lastUpdated || "Last updated: May 2026"}</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {(t.sections || []).map((section: any, i: number) => (
          <section key={i}>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{section.title}</h2>
            <p className="mt-2">{section.text}</p>
            {section.list && (
              <ul className="mt-2 list-inside list-disc space-y-1">
                {section.list.map((item: string, j: number) => <li key={j}>{item}</li>)}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
