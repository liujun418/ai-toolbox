import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ai.toolboxonline.club";

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/pricing`, lastModified: new Date() },
    { url: `${baseUrl}/privacy`, lastModified: new Date() },
    { url: `${baseUrl}/terms`, lastModified: new Date() },
    { url: `${baseUrl}/tools/background-remover`, lastModified: new Date() },
    { url: `${baseUrl}/tools/avatar-generator`, lastModified: new Date() },
    { url: `${baseUrl}/tools/watermark-remover`, lastModified: new Date() },
    { url: `${baseUrl}/tools/photo-restorer`, lastModified: new Date() },
    { url: `${baseUrl}/tools/pdf-to-word`, lastModified: new Date() },
  ];
}
