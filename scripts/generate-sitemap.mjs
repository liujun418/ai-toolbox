import { writeFileSync } from "fs";
import { fileURLToPath } from "url";

const BASE = "https://ai.toolboxonline.club";
const LOCALES = ["en", "es", "ar"];

const tools = [
  "background-remover", "watermark-remover", "photo-restorer",
  "avatar-generator", "pdf-to-word", "image-upscaler",
  "style-transfer", "text-polish",
];

const staticPages = [
  ["about", "0.6"], ["pricing", "0.8"], ["dashboard", "0.7"],
  ["privacy", "0.3"], ["terms", "0.3"], ["contact", "0.5"],
  ["login", "0.4"], ["signup", "0.5"],
];

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/'/g, "&apos;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const d = new Date();
const pad = (n) => String(n).padStart(2, "0");
const lm = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}+00:00`;

let xml = '<?xml version="1.0" encoding="utf-8" standalone="yes"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';

for (const l of LOCALES) {
  // Home
  xml += `<url><loc>${esc(BASE)}/${l}</loc><lastmod>${lm}</lastmod><priority>1.0</priority><changefreq>daily</changefreq></url>`;

  // Static
  for (const [pg, pri] of staticPages) {
    xml += `<url><loc>${esc(BASE)}/${l}/${pg}</loc><lastmod>${lm}</lastmod><priority>${pri}</priority><changefreq>monthly</changefreq></url>`;
  }

  // Tools
  for (const t of tools) {
    xml += `<url><loc>${esc(BASE)}/${l}/tools/${t}</loc><lastmod>${lm}</lastmod><priority>0.8</priority><changefreq>weekly</changefreq></url>`;
  }
}

xml += `</urlset>`;

const out = fileURLToPath(new URL("../public/sitemap.xml", import.meta.url));
writeFileSync(out, xml);
console.log("Generated", out, `(${tools.length} tools, ${LOCALES.length} locales)`);
