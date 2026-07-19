import Link from "next/link";
import type { Metadata } from "next";
import { getDictionary, isValidLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { fetchBlogPosts } from "@/lib/blog";
import { tools as allTools } from "@/lib/tools";

const PER_PAGE = 12;
const SITE_URL = "https://ai.toolboxonline.club";

function Pagination({ currentPage, totalPages, locale }: { currentPage: number; totalPages: number; locale: string }) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav className="mt-12 flex items-center justify-center gap-1" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link href={`/${locale}/blog?page=${currentPage - 1}`} className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
          ← Previous
        </Link>
      ) : (
        <span className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 dark:text-zinc-700 cursor-not-allowed">← Previous</span>
      )}
      <div className="hidden sm:flex gap-1">
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-2 py-1 text-zinc-400">…</span>
          ) : (
            <Link key={p} href={`/${locale}/blog${p === 1 ? "" : `?page=${p}`}`} className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              p === currentPage
                ? "bg-blue-600 text-white"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}>
              {p}
            </Link>
          )
        )}
      </div>
      <span className="text-sm text-zinc-500 dark:text-zinc-400 sm:hidden px-2">{currentPage} / {totalPages}</span>
      {currentPage < totalPages ? (
        <Link href={`/${locale}/blog?page=${currentPage + 1}`} className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
          Next →
        </Link>
      ) : (
        <span className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 dark:text-zinc-700 cursor-not-allowed">Next →</span>
      )}
    </nav>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return {
    title: "AI ToolBox Blog — AI Tool Guides, Tips & Tutorials",
    description: "Tips, guides, and tutorials to get the most out of AI tools.",
    alternates: {
      canonical: `${SITE_URL}/en/blog`,
      languages: { "x-default": `${SITE_URL}/en/blog`, en: `${SITE_URL}/en/blog`, es: `${SITE_URL}/es/blog`, ar: `${SITE_URL}/ar/blog` },
    },
  };
}

export default async function BlogIndex({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ page?: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return null;
  const dict = await getDictionary(locale as Locale);
  const allPosts = await fetchBlogPosts();
  const sp = await searchParams;
  const currentPage = Math.max(1, parseInt(sp.page || "1", 10));
  const totalPages = Math.ceil(allPosts.length / PER_PAGE);
  const safePage = Math.min(currentPage, totalPages);
  const posts = allPosts.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);
  const bg = (dict as any)?.blog || {};

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <nav className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
        <Link href={`/${locale}`} className="hover:text-blue-600 dark:hover:text-blue-400">{bg.home || "Home"}</Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-zinc-900 dark:text-white">{bg.blog || "Blog"}</span>
        {safePage > 1 && <><span className="mx-2">/</span><span className="text-zinc-500">Page {safePage}</span></>}
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">{bg.title || "AI ToolBox Blog"}</h1>
        <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">{bg.description || "Tips, guides, and tutorials to get the most out of AI tools."}{" "}{allPosts.length} articles — page {safePage} of {totalPages}.</p>
      </header>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: bg.title || "AI ToolBox Blog",
            description: bg.description || "Tips, guides, and tutorials for AI tools",
            url: `${SITE_URL}/${locale}/blog`,
            blogPost: posts.map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              description: p.description,
              datePublished: p.date,
              url: `${SITE_URL}/${locale}/blog/${p.slug}`,
            })),
          }),
        }}
      />

      <div className="space-y-6">
        {posts.map((post) => {
          const related = (post.relatedTools || [])
            .map((id) => allTools.find((t) => t.id === id))
            .filter(Boolean);
          return (
            <article key={post.slug} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mb-2">
                <time dateTime={post.date}>{post.date}</time>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">{post.category}</span>
              </div>
              <Link href={`/${locale}/blog/${post.slug}`} className="group">
                <h2 className="text-xl font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">{post.title}</h2>
              </Link>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{post.description}</p>
              {related.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {related.map((t: any) => (
                    <Link key={t.id} href={`/${locale}/tools/${t.id}`} className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700">{t.icon} {t.name}</Link>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <Pagination currentPage={safePage} totalPages={totalPages} locale={locale} />
    </div>
  );
}