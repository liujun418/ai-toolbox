"use client";

import Link from "next/link";
import { tools as allTools, CATEGORIES } from "@/lib/tools";
import { getCreditCost } from "@/lib/creditCosts";

interface ToolsGridProps {
  locale: string;
  dict: Record<string, unknown>;
}

export default function ToolsGrid({ locale, dict }: ToolsGridProps) {
  const t = dict as any;
  const home = t.home || {};
  const tools_i18n = t.tools || {};

  const creditsLabel = (credits: number) =>
    credits === 0 ? (home.free || "Free") : `${credits} ${home.credits || "credits"}`;

  const catNames: Record<string, string> = {
    "image-generation": home.categoryImageGeneration || "Image Generation",
    "image-editing": home.categoryImageEditing || "Image Editing",
    "content-creation": home.categoryContentCreation || "Content Creation",
    document: home.categoryDocument || "Document",
  };

  const catList = CATEGORIES.map((cat) => {
    const catTools = allTools
      .filter((tool) => tool.category === cat.id && !tool.hidden)
      .map((tool) => ({
        id: tool.id,
        name: tools_i18n[tool.id]?.name || tool.name,
        description: tools_i18n[tool.id]?.description || tool.description,
        icon: tool.icon,
        credits: getCreditCost(tool.id),
        href: `/${locale}/tools/${tool.id}`,
        badge: tool.free ? (home.free || "Free") : (tools_i18n[tool.id]?.badge || tool.badge) || null,
      }));
    return { ...cat, catTools };
  }).filter(cat => cat.catTools.length > 0);

  return (
    <section className="mt-12 sm:mt-16">
      <h2 className="mb-8 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
        {home.allTools || "All Tools"}
      </h2>

      {catList.map((cat) => (
        <section key={cat.id} id={cat.id} className="mb-12">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="flex items-baseline gap-3 text-xl font-semibold text-zinc-900 dark:text-white">
              {cat.icon} {catNames[cat.id]}
              <span className="text-sm font-normal text-zinc-400 dark:text-zinc-500">
                {cat.catTools.length} {home.toolsCount || "tools"}
              </span>
            </h3>
            {cat.id === "image-editing" && (
              <Link href={`/${locale}/ai-image-editing`} className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                {home.exploreMoreImageEditing || "Explore AI photo editing tools →"}
              </Link>
            )}
            {cat.id === "content-creation" && (
              <Link href={`/${locale}/ai-content-creation`} className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                {home.exploreMoreContentCreation || "Explore AI content creation tools →"}
              </Link>
            )}
            {cat.id === "image-generation" && (
              <Link href={`/${locale}/ai-image-generation`} className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                {home.exploreMoreImageGeneration || "Explore AI image generation tools →"}
              </Link>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cat.catTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className="group relative rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                {tool.badge && (
                  <span
                    className={`absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      tool.badge === (home.popular || "Popular")
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                        : tool.badge === (home.free || "Free")
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
      ))}
    </section>
  );
}
