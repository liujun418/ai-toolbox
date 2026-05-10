import { MetadataRoute } from "next";

const BASE_URL = "https://ai.toolboxonline.club";
const LOCALES = ["en", "es", "ar"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const locale of LOCALES) {
    const base = `${BASE_URL}/${locale}`;

    // Home
    entries.push({
      url: base,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.filter((l) => l !== locale).map((l) => [l, `${BASE_URL}/${l}`])
        ),
      },
    });

    // Static pages
    const staticPages: { path: string; priority: number }[] = [
      { path: "/about", priority: 0.6 },
      { path: "/pricing", priority: 0.8 },
      { path: "/dashboard", priority: 0.7 },
      { path: "/privacy", priority: 0.3 },
      { path: "/terms", priority: 0.3 },
      { path: "/contact", priority: 0.5 },
      { path: "/login", priority: 0.4 },
      { path: "/signup", priority: 0.5 },
    ];
    for (const p of staticPages) {
      entries.push({
        url: `${base}${p.path}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: p.priority,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.filter((l) => l !== locale).map((l) => [l, `${BASE_URL}/${l}${p.path}`])
          ),
        },
      });
    }

    // Tool pages
    const toolPages: { path: string; priority: number }[] = [
      { path: "/tools/background-remover", priority: 0.8 },
      { path: "/tools/watermark-remover", priority: 0.7 },
      { path: "/tools/photo-restorer", priority: 0.7 },
      { path: "/tools/avatar-generator", priority: 0.8 },
      { path: "/tools/pdf-to-word", priority: 0.7 },
      { path: "/tools/image-upscaler", priority: 0.8 },
      { path: "/tools/style-transfer", priority: 0.8 },
      { path: "/tools/text-polish", priority: 0.8 },
    ];
    for (const t of toolPages) {
      entries.push({
        url: `${base}${t.path}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: t.priority,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.filter((l) => l !== locale).map((l) => [l, `${BASE_URL}/${l}${t.path}`])
          ),
        },
      });
    }
  }

  // ToolBoxOnline sibling site pages (en locale primary)
  const siblingBase = "https://toolboxonline.club/en";
  const siblingPages: { path: string; priority: number }[] = [
    { path: "", priority: 0.9 },
    { path: "/about", priority: 0.6 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
    { path: "/contact", priority: 0.5 },
  ];
  for (const p of siblingPages) {
    entries.push({
      url: `${siblingBase}${p.path}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: p.priority,
    });
  }

  return entries;
}
