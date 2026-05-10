const BASE_URL = "https://ai.toolboxonline.club";
const LOCALES = ["en", "es", "ar"];

function iso(offsetHours: number): string {
  const d = new Date();
  d.setUTCHours(d.getUTCHours() + offsetHours);
  const sign = offsetHours >= 0 ? "+" : "-";
  const h = String(Math.abs(offsetHours)).padStart(2, "0");
  return d.toISOString().replace(/\.\d{3}Z$/, `${sign}${h}:00`);
}

const now = iso(8); // Asia/Shanghai

function urlEl(
  loc: string,
  priority: string,
  changefreq: string,
  lastmod: string | null,
  hreflangs: [string, string][] | null
): string {
  let xml = `<url><loc>${esc(loc)}</loc>`;
  if (lastmod !== null) {
    xml += `<lastmod>${lastmod}</lastmod>`;
  }
  xml += `<priority>${priority}</priority><changefreq>${changefreq}</changefreq>`;
  if (hreflangs) {
    for (const [lang, href] of hreflangs) {
      xml += `<xhtml:link rel="alternate" hreflang="${lang}" href="${esc(href)}"/>`;
    }
  }
  xml += `</url>`;
  return xml;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/'/g, "&apos;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function GET(): Promise<Response> {
  const parts: string[] = [];

  for (const locale of LOCALES) {
    const base = `${BASE_URL}/${locale}`;

    // Home
    parts.push(
      urlEl(base, "1.0", "daily", now,
        LOCALES.filter((l) => l !== locale).map((l) => [l, `${BASE_URL}/${l}`])
      )
    );

    // Static pages
    const staticPages: [string, string][] = [
      ["/about", "0.6"], ["/pricing", "0.8"], ["/dashboard", "0.7"],
      ["/privacy", "0.3"], ["/terms", "0.3"], ["/contact", "0.5"],
      ["/login", "0.4"], ["/signup", "0.5"],
    ];
    for (const [path, priority] of staticPages) {
      parts.push(
        urlEl(`${base}${path}`, priority, "monthly", now,
          LOCALES.filter((l) => l !== locale).map((l) => [l, `${BASE_URL}/${l}${path}`])
        )
      );
    }

    // Tool pages
    const toolPages: [string, string][] = [
      ["/tools/background-remover", "0.8"], ["/tools/watermark-remover", "0.7"],
      ["/tools/photo-restorer", "0.7"], ["/tools/avatar-generator", "0.8"],
      ["/tools/pdf-to-word", "0.7"], ["/tools/image-upscaler", "0.8"],
      ["/tools/style-transfer", "0.8"], ["/tools/text-polish", "0.8"],
    ];
    for (const [path, priority] of toolPages) {
      parts.push(
        urlEl(`${base}${path}`, priority, "weekly", now,
          LOCALES.filter((l) => l !== locale).map((l) => [l, `${BASE_URL}/${l}${path}`])
        )
      );
    }
  }

  // ToolBoxOnline sibling site
  const siblingBase = "https://toolboxonline.club/en";
  const siblingPages: [string, string, string][] = [
    ["", "0.9", "weekly"], ["/about", "0.6", "monthly"],
    ["/privacy", "0.3", "monthly"], ["/terms", "0.3", "monthly"],
    ["/contact", "0.5", "monthly"],
  ];
  for (const [path, priority, freq] of siblingPages) {
    parts.push(urlEl(`${siblingBase}${path}`, priority, freq, now, null));
  }

  const body = `<?xml version="1.0" encoding="utf-8" standalone="yes"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${parts.join("")}</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}

export const dynamic = "force-static";
