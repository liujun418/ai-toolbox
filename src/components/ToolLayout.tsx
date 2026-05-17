import Link from "next/link";
import { tools } from "@/lib/tools";
import type { Tool } from "@/lib/tools";
import { getCreditCost } from "@/lib/creditCosts";

interface ToolLayoutProps {
  toolId: string;
  locale?: string;
  dict?: Record<string, unknown>;
  titleOverride?: string;
  descriptionOverride?: string;
  children: React.ReactNode;
}

function getDictText(dict: Record<string, unknown> | undefined, path: string, fallback: string): string {
  if (!dict) return fallback;
  const keys = path.split(".");
  let current: unknown = dict;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else return fallback;
  }
  return typeof current === "string" ? current : fallback;
}

export default function ToolLayout({
  toolId,
  locale = "en",
  dict,
  titleOverride,
  descriptionOverride,
  children,
}: ToolLayoutProps) {
  const tool: Tool | undefined = tools.find((t) => t.id === toolId);
  const tp = (dict as any)?.toolPage || {};
  const toolDict = toolId ? ((dict as any)?.tools?.[toolId] as Record<string, string> | undefined) : undefined;

  const homeLabel = (tp.home as string) || "Home";
  const startOverLabel = (tp.startOver as string) || "Back to Tools";
  const title = titleOverride || toolDict?.name || tool?.name || "";
  const description = descriptionOverride || toolDict?.description || tool?.description || "";
  const creditCost = tool ? getCreditCost(tool.id) : 0;
  const isFree = creditCost === 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400" aria-label="Breadcrumb">
        <Link href={`/${locale}`} className="hover:text-blue-600 dark:hover:text-blue-400">{homeLabel}</Link>
        <span>/</span>
        <span className="font-medium text-zinc-900 dark:text-white">{title}</span>
        <Link href={`/${locale}`} className="ml-auto text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
          ← {startOverLabel}
        </Link>
      </nav>

      {/* BreadcrumbList structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: homeLabel, item: `https://ai.toolboxonline.club/${locale}` },
              { "@type": "ListItem", position: 2, name: title },
            ],
          }),
        }}
      />

      {/* Title + description */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {tool?.icon} {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{description}</p>

        {/* Credit badge */}
        <div className="mt-2">
          {isFree ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-green-50 to-emerald-100 px-3 py-1 text-sm font-semibold text-green-800 shadow-sm ring-1 ring-green-200/60 dark:from-green-900/20 dark:to-emerald-900/20 dark:text-green-300 dark:ring-green-700/40">
              🆓 {getDictText(dict, `tools.${toolId}.cost1`, "Free")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-50 to-yellow-100 px-3 py-1 text-sm font-semibold text-amber-800 shadow-sm ring-1 ring-amber-200/60 dark:from-amber-900/20 dark:to-yellow-900/20 dark:text-amber-300 dark:ring-amber-700/40">
              💎 {getDictText(dict, `tools.${toolId}.cost`, `${creditCost} credits`)}
            </span>
          )}
          {tool?.badge && (
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs text-blue-700 ring-1 ring-blue-200/60 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-700/40">
              {tool.badge}
            </span>
          )}
        </div>
      </header>

      {/* WebApplication structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: `${title} — AI ToolBox`,
            description,
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: creditCost > 0 ? creditCost.toString() : "0", priceCurrency: "USD" },
          }),
        }}
      />

      {/* Tool content */}
      {children}
    </div>
  );
}
