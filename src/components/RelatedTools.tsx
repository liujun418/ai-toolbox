import Link from "next/link";
import { tools as allTools } from "@/lib/tools";
import { getCreditCost } from "@/lib/creditCosts";

interface RelatedToolsProps {
  toolId: string;
  locale: string;
  dict: Record<string, unknown>;
}

export default function RelatedTools({ toolId, locale, dict }: RelatedToolsProps) {
  const tool = allTools.find((t) => t.id === toolId);
  if (!tool?.relatedTools?.length) return null;

  const related = tool.relatedTools
    .map((id) => allTools.find((t) => t.id === id))
    .filter(Boolean);

  if (!related.length) return null;

  const tools_i18n = (dict as any)?.tools || {};
  const home = (dict as any)?.home || {};

  const creditsLabel = (credits: number) =>
    credits === 0 ? (home.free || "Free") : `${credits} ${home.credits || "credits"}`;

  return (
    <section className="mt-12">
      <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
        {home.relatedTools || "You Might Also Like"}
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {related.map((rt: any) => (
          <Link
            key={rt.id}
            href={`/${locale}/tools/${rt.id}`}
            className="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            <span className="text-2xl">{rt.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                {tools_i18n[rt.id]?.name || rt.name}
              </p>
              <p className="truncate text-xs text-zinc-400 dark:text-zinc-500">
                {tools_i18n[rt.id]?.description || rt.description}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
              {creditsLabel(getCreditCost(rt.id))}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
