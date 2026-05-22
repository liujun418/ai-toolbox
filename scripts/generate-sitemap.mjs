import { writeFileSync } from "fs";
import { fileURLToPath } from "url";

const BASE = "https://ai.toolboxonline.club";
const LOCALES = ["en", "es", "ar"];

const tools = [
  "ai-image-generator", "avatar-generator", "background-remover",
  "watermark-remover", "photo-restorer",
  "image-upscaler", "style-transfer", "text-polish",
  "face-blur", "article-generator",
  "text-to-speech", "image-description", "colorizer", "object-remover",
];

const staticPages = [
  ["about", "0.6"], ["pricing", "0.8"],
  ["privacy", "0.3"], ["terms", "0.3"], ["contact", "0.5"],
];

// Topic landing pages (long-tail keyword hubs)
const topicPages = [
  "ai-image-editing", "ai-content-creation",
  "ai-photo-restoration", "ai-image-generation",
];

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/'/g, "&apos;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function hreflangUrl(locale, path) {
  return `<xhtml:link rel="alternate" hreflang="${locale}" href="${esc(BASE)}/${locale}/${path}"/>`;
}

function hreflangBlock(locale, path) {
  return LOCALES.map((l) => hreflangUrl(l, path)).join("") + hreflangUrl("x-default", path.replace(/^en/, "en"));
}

const d = new Date();
const pad = (n) => String(n).padStart(2, "0");
const lm = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}+00:00`;

let xml = '<?xml version="1.0" encoding="utf-8" standalone="yes"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';

for (const l of LOCALES) {
  // Home
  xml += `<url><loc>${esc(BASE)}/${l}</loc><lastmod>${lm}</lastmod><priority>1.0</priority><changefreq>daily</changefreq>${hreflangBlock(l, "")}</url>`;

  // Topic pages
  for (const tp of topicPages) {
    xml += `<url><loc>${esc(BASE)}/${l}/${tp}</loc><lastmod>${lm}</lastmod><priority>0.7</priority><changefreq>weekly</changefreq>${hreflangBlock(l, tp)}</url>`;
  }

  // Static
  for (const [pg, pri] of staticPages) {
    xml += `<url><loc>${esc(BASE)}/${l}/${pg}</loc><lastmod>${lm}</lastmod><priority>${pri}</priority><changefreq>monthly</changefreq></url>`;
  }

  // Tools
  for (const t of tools) {
    xml += `<url><loc>${esc(BASE)}/${l}/tools/${t}</loc><lastmod>${lm}</lastmod><priority>0.8</priority><changefreq>weekly</changefreq>${hreflangBlock(l, `tools/${t}`)}</url>`;
  }

  // Blog
  xml += `<url><loc>${esc(BASE)}/${l}/blog</loc><lastmod>${lm}</lastmod><priority>0.7</priority><changefreq>weekly</changefreq>${hreflangBlock(l, "blog")}</url>`;
  const blogSlugs = ["how-to-remove-image-background-without-photoshop","best-ai-tools-content-creators-2026","restore-old-photos-ai-guide","ai-image-generator-prompt-guide","remove-watermark-from-photo","text-to-speech-for-content-creators","colorize-black-and-white-photos","ai-article-writing-vs-human","upscale-images-without-losing-quality","blur-faces-in-photos-privacy","best-ai-background-removers-compared","ai-image-upscalers-compared","restore-old-photos-ai-vs-professional"];
  for (const slug of blogSlugs) {
    xml += `<url><loc>${esc(BASE)}/${l}/blog/${slug}</loc><lastmod>${lm}</lastmod><priority>0.6</priority><changefreq>monthly</changefreq>${hreflangBlock(l, `blog/${slug}`)}</url>`;
  }
}

xml += `</urlset>`;

const out = fileURLToPath(new URL("../public/sitemap.xml", import.meta.url));
writeFileSync(out, xml);
console.log("Generated", out, `(${tools.length} tools, ${LOCALES.length} locales)`);
