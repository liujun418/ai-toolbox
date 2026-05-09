import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ai.toolboxonline.club";
  const now = new Date();

  const publicPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/signup`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const toolPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/tools/background-remover`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/tools/avatar-generator`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/tools/watermark-remover`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/tools/photo-restorer`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/tools/pdf-to-word`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  return [...publicPages, ...toolPages];
}
