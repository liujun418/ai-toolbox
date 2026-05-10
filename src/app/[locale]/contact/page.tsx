import { getDictionary, isValidLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = (dict as any).contact || {};

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">{t.title || "Contact Us"}</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t.subtitle || "We'd love to hear from you"}</p>

      <div className="mt-8 space-y-8">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{t.email || "Email"}</h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t.emailDesc || "For general inquiries, support, or feedback:"}</p>
          <a href="mailto:jzerov@live.com" className="mt-2 inline-block text-blue-600 hover:underline">jzerov@live.com</a>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{t.responseTime || "Response Time"}</h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t.responseText || 'We aim to respond to all inquiries within 24 hours. For urgent matters, please include "URGENT" in your email subject line.'}</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{t.commonQuestions || "Common Questions"}</h2>
          <div className="mt-4 space-y-4">
            {(t.faq || []).map((item: any, i: number) => (
              <details key={i} className="group">
                <summary className="cursor-pointer text-sm font-medium text-zinc-700 dark:text-zinc-300">{item.q}</summary>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
