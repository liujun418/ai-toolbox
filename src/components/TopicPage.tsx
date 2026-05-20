import Link from "next/link";
import { tools as allTools } from "@/lib/tools";
import { getCreditCost } from "@/lib/creditCosts";

export interface TopicData {
  id: string;
  icon: string;
  title: string;
  description: string;
  intro: string;
  toolIds: string[];
  faq: { question: string; answer: string }[];
  translations?: Record<string, { title: string; description: string; intro: string }>;
}

interface TopicPageProps {
  topic: TopicData;
  locale: string;
  dict: Record<string, unknown>;
}

function t(text: string, topic: TopicData, locale: string): string {
  if (locale === 'en') return text;
  const trans = topic.translations?.[locale];
  if (!trans) return text;
  if (text === topic.title) return trans.title || text;
  if (text === topic.description) return trans.description || text;
  if (text === topic.intro) return trans.intro || text;
  return text;
}

export default function TopicPage({ topic, locale, dict }: TopicPageProps) {
  const tools_i18n = (dict as any)?.tools || {};
  const home = (dict as any)?.home || {};
  const tp = (dict as any)?.toolPage || {};

  const title = t(topic.title, topic, locale);
  const description = t(topic.description, topic, locale);
  const intro = t(topic.intro, topic, locale);

  const resolvedTools = topic.toolIds
    .map((id) => allTools.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => !!t && !t.hidden);

  const creditsLabel = (credits: number) =>
    credits === 0 ? (home.free || "Free") : `${credits} ${home.credits || "credits"}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400" aria-label="Breadcrumb">
        <Link href={`/${locale}`} className="hover:text-blue-600 dark:hover:text-blue-400">{home.title || "Home"}</Link>
        <span>/</span>
        <span className="font-medium text-zinc-900 dark:text-white">{title}</span>
      </nav>

      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: home.title || "Home", item: `https://ai.toolboxonline.club/${locale}` },
              { "@type": "ListItem", position: 2, name: title },
            ],
          }),
        }}
      />

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {topic.icon} {title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{description}</p>
        <p className="mt-4 text-sm leading-relaxed text-zinc-500 dark:text-zinc-500">{intro}</p>
      </header>

      {/* CollectionPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: title,
            description: description,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: resolvedTools.map((t: any, i: number) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "WebApplication",
                  name: tools_i18n[t.id]?.name || t.name,
                  description: tools_i18n[t.id]?.description || t.description,
                  url: `https://ai.toolboxonline.club/${locale}/tools/${t.id}`,
                },
              })),
            },
          }),
        }}
      />

      {/* Tool Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {resolvedTools.map((tool: any) => (
          <Link
            key={tool.id}
            href={`/${locale}/tools/${tool.id}`}
            className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-2xl">{tool.icon}</span>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {tools_i18n[tool.id]?.name || tool.name}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {tools_i18n[tool.id]?.description || tool.description}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                {creditsLabel(getCreditCost(tool.id))}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* FAQ */}
      {topic.faq.length > 0 && (
        <section className="mt-12 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-white">
            {tp.faq || "Frequently Asked Questions"}
          </h2>
          <div className="space-y-2">
            {topic.faq.map((item, i) => (
              <details key={i} className="group rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                <summary className="cursor-pointer text-sm font-semibold text-zinc-800 dark:text-zinc-200 marker:text-blue-500">{item.question}</summary>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Schema */}
      {topic.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: topic.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            }),
          }}
        />
      )}
    </div>
  );
}
