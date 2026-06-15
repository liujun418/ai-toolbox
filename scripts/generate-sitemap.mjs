import { writeFileSync } from "fs";
import { fileURLToPath } from "url";

const BASE = "https://ai.toolboxonline.club";
const today = new Date().toISOString().split("T")[0] + "T00:00:00+00:00";

const tools = [
  "ai-image-generator","avatar-generator","background-remover",
  "watermark-remover","photo-restorer","image-upscaler",
  "style-transfer","text-polish","face-blur","article-generator",
  "text-to-speech","image-description","colorizer","object-remover",
];

const blogSlugs = [
  "how-to-remove-image-background-without-photoshop","best-ai-tools-content-creators-2026",
  "restore-old-photos-ai-guide","ai-image-generator-prompt-guide",
  "remove-watermark-from-photo","text-to-speech-for-content-creators",
  "colorize-black-and-white-photos","ai-article-writing-vs-human",
  "upscale-images-without-losing-quality","blur-faces-in-photos-privacy",
  "best-ai-background-removers-compared","ai-image-upscalers-compared",
  "restore-old-photos-ai-vs-professional","face-blur-privacy-guide",
  "ai-style-transfer-vs-image-generation","ai-avatar-generator-style-guide",
  "ai-object-remover-tutorial","text-to-speech-practical-guide",
  "photo-restoration-workflow","ai-image-describer-practical-guide",
  "text-polish-multilingual-guide","ai-vs-pro-photo-restoration",
  "ai-image-generator-settings-guide","tts-audio-quality-tips",
  "colorizer-mistakes-guide","watermark-remover-mistakes-guide",
  "ai-prompt-blurry-fix-guide","avatar-generator-lessons-guide",
  "bg-remover-auto-vs-manual","upscaler-mistakes-guide",
  "article-generator-hybrid-guide","ai-consistent-image-guide",
];

const topicPages = ["ai-image-editing","ai-content-creation","ai-photo-restoration","ai-image-generation"];
const staticPages = ["about","pricing","privacy","terms","contact"];

function esc(s) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;"); }

let xml = '<?xml version="1.0" encoding="utf-8" standalone="yes"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';

// Homepage
xml += `<url><loc>${esc(BASE)}/</loc><priority>1.0</priority><changefreq>daily</changefreq></url>`;

// Tools
for (const t of tools) {
  xml += `<url><loc>${esc(BASE)}/en/tools/${t}/</loc><lastmod>${today}</lastmod><priority>0.9</priority><changefreq>weekly</changefreq></url>`;
}

// Blog
xml += `<url><loc>${esc(BASE)}/en/blog/</loc><lastmod>${today}</lastmod><priority>0.8</priority><changefreq>weekly</changefreq></url>`;
for (const slug of blogSlugs) {
  xml += `<url><loc>${esc(BASE)}/en/blog/${slug}/</loc><lastmod>${today}</lastmod><priority>0.8</priority><changefreq>weekly</changefreq></url>`;
}

// Topic pages
for (const topic of topicPages) {
  xml += `<url><loc>${esc(BASE)}/en/${topic}/</loc><lastmod>${today}</lastmod><priority>0.7</priority><changefreq>weekly</changefreq></url>`;
}

// Static pages
for (const page of staticPages) {
  xml += `<url><loc>${esc(BASE)}/en/${page}/</loc><lastmod>${today}</lastmod><priority>0.5</priority><changefreq>monthly</changefreq></url>`;
}

xml += "</urlset>";

const outPath = fileURLToPath(new URL("../public/sitemap.xml", import.meta.url));
writeFileSync(outPath, xml);
console.log(`Generated sitemap.xml (${tools.length} tools, ${blogSlugs.length} blogs)`);
