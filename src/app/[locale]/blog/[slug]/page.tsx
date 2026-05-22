import Link from "next/link";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { getBlogPost, getBlogPosts, fetchBlogPost } from "@/lib/blog";
import { tools as allTools } from "@/lib/tools";
import ShareBar from "@/components/ShareBar";

export function generateStaticParams() {
  return getBlogPosts().flatMap((post) =>
    ["en", "es", "ar"].map((locale) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — AI ToolBox Blog`,
    description: post.description,
    keywords: post.tags?.join(", "),
    openGraph: { title: post.title, description: post.description, url: `https://ai.toolboxonline.club/en/blog/${slug}`, type: "article" as const },
    twitter: { card: "summary_large_image" as const, title: post.title, description: post.description },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) notFound();
  const dict = await getDictionary(locale as Locale);
  const bg = (dict as any)?.blog || {};

  const related = (post.relatedTools || [])
    .map((id) => allTools.find((t) => t.id === id))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
        <Link href={`/${locale}`} className="hover:text-blue-600 dark:hover:text-blue-400">{bg.home || "Home"}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/blog`} className="hover:text-blue-600 dark:hover:text-blue-400">{bg.blog || "Blog"}</Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-zinc-900 dark:text-white truncate">{post.title}</span>
      </nav>

      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            url: `https://ai.toolboxonline.club/${locale}/blog/${slug}`,
            author: { "@type": "Organization", name: "AI ToolBox" },
            publisher: { "@type": "Organization", name: "AI ToolBox", url: "https://ai.toolboxonline.club" },
            keywords: post.tags?.join(", "),
          }),
        }}
      />

      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `https://ai.toolboxonline.club/${locale}` },
              { "@type": "ListItem", position: 2, name: "Blog", item: `https://ai.toolboxonline.club/${locale}/blog` },
              { "@type": "ListItem", position: 3, name: post.title },
            ],
          }),
        }}
      />

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mb-3">
          <time dateTime={post.date}>{post.date}</time>
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">{post.category}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{post.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags?.map((tag) => (
            <span key={tag} className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">{tag}</span>
          ))}
        </div>
      </header>

      {/* Article Content */}
      <div className="prose prose-zinc dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3"]),
        allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, img: ["src", "alt", "title"], a: ["href", "title", "rel", "target"] },
      }) }} />

      {/* Related Tools */}
      {related.length > 0 && (
        <section className="mt-12 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">{bg.toolsMentioned || "Tools Mentioned in This Article"}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((t: any) => (
              <Link key={t.id} href={`/${locale}/tools/${t.id}`} className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-3 transition-all hover:border-blue-200 hover:bg-blue-50/50 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-blue-700">
                <span className="text-xl">{t.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900 group-hover:text-blue-600 dark:text-white">{t.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{t.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back to Blog */}
      <ShareBar locale={locale} dict={dict as Record<string, unknown>} />

      <div className="mt-8">
        <Link href={`/${locale}/blog`} className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">← {bg.backToBlog || "Back to all articles"}</Link>
      </div>
    </div>
  );
}
