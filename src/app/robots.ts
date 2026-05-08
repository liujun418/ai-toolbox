import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/login", "/signup"],
    },
    sitemap: "https://ai.toolboxonline.club/sitemap.xml",
  };
}
