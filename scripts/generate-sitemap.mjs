import { readFileSync, writeFileSync } from "fs";

const TOOLS_TS = new URL("../src/lib/tools.ts", import.meta.url).pathname.replace(/^\/([a-z]):\//i, "$1:/");
const BLOG_TS = new URL("../src/lib/blog.ts", import.meta.url).pathname.replace(/^\/([a-z]):\//i, "$1:/");
const src = readFileSync(TOOLS_TS, "utf-8").replace(/\r\n/g, "\n");
const blogSrc = readFileSync(BLOG_TS, "utf-8").replace(/\r\n/g, "\n");

const SITE = "https://ai.toolboxonline.club";
const today = new Date().toISOString().split("T")[0] + "T00:00:00+00:00";

// Tools: match top-level tool objects only (`  {` then `    id: "..."`),
// skipping inline relatedTools objects like `{id:"...",reason:"..."}`.
const tools = [];
const toolRe = /^\s{2}\{\n\s{4}id:\s*"([^"]+)"/gm;
let m;
while ((m = toolRe.exec(src))) tools.push(m[1]);

// Blog slugs: collect every `slug: "..."` entry, deduplicated.
const blogSlugs = [];
const slugRe = /slug:\s*"([^"]+)"/g;
let sm;
while ((sm = slugRe.exec(blogSrc))) blogSlugs.push(sm[1]);
const uniqueBlogSlugs = [...new Set(blogSlugs)];

const topicPages = ["ai-image-editing", "ai-content-creation", "ai-photo-restoration", "ai-image-generation"];
const staticPages = ["about", "pricing", "privacy", "terms", "contact"];

function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"); }

let xml = '<?xml version="1.0" encoding="utf-8" standalone="yes"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';

// Homepage
xml += `<url><loc>${esc(SITE)}/</loc><priority>1.0</priority><changefreq>daily</changefreq></url>`;

// Tools
for (const t of tools) {
  xml += `<url><loc>${esc(SITE)}/en/tools/${t}/</loc><lastmod>${today}</lastmod><priority>0.9</priority><changefreq>weekly</changefreq></url>`;
}

// Blog
xml += `<url><loc>${esc(SITE)}/en/blog/</loc><lastmod>${today}</lastmod><priority>0.8</priority><changefreq>weekly</changefreq></url>`;
for (const slug of uniqueBlogSlugs) {
  xml += `<url><loc>${esc(SITE)}/en/blog/${slug}/</loc><lastmod>${today}</lastmod><priority>0.8</priority><changefreq>weekly</changefreq></url>`;
}

// Topic pages
for (const topic of topicPages) {
  xml += `<url><loc>${esc(SITE)}/en/${topic}/</loc><lastmod>${today}</lastmod><priority>0.7</priority><changefreq>weekly</changefreq></url>`;
}

// Static pages
for (const page of staticPages) {
  xml += `<url><loc>${esc(SITE)}/en/${page}/</loc><lastmod>${today}</lastmod><priority>0.5</priority><changefreq>monthly</changefreq></url>`;
}

xml += "</urlset>";

const outPath = new URL("../public/sitemap.xml", import.meta.url).pathname.replace(/^\/([a-z]):\//i, "$1:/");
writeFileSync(outPath, xml);
console.log(`Generated sitemap.xml (${tools.length} tools, ${uniqueBlogSlugs.length} blogs)`);
