const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "mobile-audit");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const BASE = "https://ai.toolboxonline.club";

const MOBILE = { width: 375, height: 812 };
const TABLET = { width: 768, height: 1024 };

const PAGES = [
  { path: "/en", name: "homepage-en" },
  { path: "/ar", name: "homepage-ar-rtl" },
  { path: "/en/pricing", name: "pricing" },
  { path: "/en/login", name: "login" },
  { path: "/en/signup", name: "signup" },
  { path: "/en/tools/ai-image-generator", name: "ai-image-gen" },
  { path: "/en/tools/background-remover", name: "bg-remover" },
  { path: "/en/tools/avatar-generator", name: "avatar-gen" },
  { path: "/en/tools/photo-restorer", name: "photo-restorer" },
  { path: "/en/tools/image-upscaler", name: "image-upscaler" },
  { path: "/en/tools/style-transfer", name: "style-transfer" },
  { path: "/en/tools/text-polish", name: "text-polish" },
  { path: "/en/tools/pdf-to-word", name: "pdf-to-word" },
  { path: "/en/tools/watermark-remover", name: "watermark-remover" },
];

const report = [];

async function auditPage(page, ctx) {
  const issues = [];

  // Check viewport meta
  const viewportMeta = await page.evaluate(() => {
    const meta = document.querySelector("meta[name='viewport']");
    return meta ? meta.getAttribute("content") : "MISSING";
  });
  if (viewportMeta === "MISSING") {
    issues.push({ severity: "CRITICAL", type: "Missing Viewport Meta", detail: ctx.name });
  }

  // Check for horizontal overflow (real scroll)
  const hasHScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth + 2;
  });
  if (hasHScroll) {
    const overflowPx = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    // Find the widest visible element
    const offender = await page.evaluate(() => {
      let maxRight = 0, details = "";
      document.querySelectorAll("body *").forEach((el) => {
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") return;
        const rect = el.getBoundingClientRect();
        if (rect.right > maxRight && rect.right < 10000) {
          maxRight = rect.right;
          details = `<${el.tagName.toLowerCase()}${el.id ? '#'+el.id : ''} class="${(el.className?.toString?.()||'').slice(0, 80)}"> text="${(el.textContent||'').trim().slice(0, 50)}"`;
        }
      });
      return { maxRight, details };
    });
    issues.push({ severity: "HIGH", type: "Horizontal Scroll", detail: `${ctx.name}: ${overflowPx.toFixed(0)}px overflow. Widest: ${offender.details}` });
  }

  // Check font sizes below 12px
  const smallFonts = await page.evaluate(() => {
    const small = [];
    document.querySelectorAll("p, span, a, button, label, input, textarea, li, td, th, h1, h2, h3, h4, h5, h6").forEach((el) => {
      const style = getComputedStyle(el);
      const size = parseFloat(style.fontSize);
      if (size > 0 && size < 12 && el.textContent?.trim()) {
        small.push({ tag: el.tagName, size, text: el.textContent.trim().slice(0, 40) });
      }
    });
    return small.slice(0, 10);
  });
  if (smallFonts.length > 0) {
    issues.push({ severity: "MEDIUM", type: "Small Font < 12px", detail: `${ctx.name}: ${smallFonts.length} elements (${smallFonts.map(f => f.size+'px').join(', ')})` });
  }

  // Check touch targets below 44px (WCAG)
  const smallTargets = await page.evaluate(() => {
    const small = [];
    document.querySelectorAll("button, a, [role='button'], input[type='submit'], input[type='button']").forEach((el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") return;
      if (rect.width === 0 || rect.height === 0) return;
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      if (style.opacity === "0") return;
      if ((rect.width < 44 || rect.height < 44) && rect.height > 10) {
        small.push({ tag: el.tagName, text: (el.textContent||"").trim().slice(0, 25) || "[icon]", w: Math.round(rect.width), h: Math.round(rect.height) });
      }
    });
    return small.slice(0, 20);
  });
  if (smallTargets.length > 0) {
    const unique = smallTargets.filter((t, i, arr) => arr.findIndex(x => x.text === t.text && x.w === t.w && x.h === t.h) === i);
    issues.push({ severity: "MEDIUM", type: "Small Touch Target < 44px", detail: `${ctx.name}: ${unique.length} types (${unique.map(t => `${t.text}(${t.w}x${t.h})`).join(', ')})` });
  }

  // Check fixed/sticky element size
  const viewportHeight = ctx.viewport === "mobile" ? MOBILE.height : TABLET.height;
  const fixedElements = await page.evaluate((vh) => {
    const fixed = [];
    document.querySelectorAll("*").forEach((el) => {
      const style = getComputedStyle(el);
      if ((style.position === "fixed" || style.position === "sticky") && style.display !== "none") {
        const rect = el.getBoundingClientRect();
        if (rect.height > vh * 0.25 && rect.width > 0) {
          fixed.push({ tag: el.tagName, height: Math.round(rect.height), heightPct: Math.round(rect.height / vh * 100), className: (el.className?.toString?.()||'').slice(0, 60) });
        }
      }
    });
    return fixed;
  }, viewportHeight);
  if (fixedElements.length > 1) {
    issues.push({ severity: "LOW", type: "Large Fixed Elements", detail: `${ctx.name}: ${fixedElements.length} fixed >25% viewport` });
  }

  return issues;
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const pageInfo of PAGES) {
    for (const viewport of [
      { name: "mobile", ...MOBILE },
      { name: "tablet", ...TABLET },
    ]) {
      const context = await browser.newContext({
        viewport,
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      });
      const page = await context.newPage();
      const url = `${BASE}${pageInfo.path}`;
      const ctx = { name: pageInfo.name, viewport: viewport.name, width: viewport.width, height: viewport.height };

      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
        await page.waitForTimeout(500);

        const screenshotFile = `${pageInfo.name}-${viewport.name}.png`;
        await page.screenshot({ path: path.join(OUT_DIR, screenshotFile), fullPage: false });

        const issues = await auditPage(page, ctx);
        issues.forEach((i) => report.push({ ...i, page: ctx.name, viewport: ctx.viewport }));

        if (issues.length > 0) {
          console.log(`${ctx.name} (${viewport.name}): ${issues.length} issues`);
          issues.forEach((i) => console.log(`  [${i.severity}] ${i.type}: ${i.detail}`));
        } else {
          console.log(`${ctx.name} (${viewport.name}): OK`);
        }
      } catch (e) {
        console.log(`ERROR: ${ctx.name} (${viewport.name}): ${e.message}`);
        report.push({ severity: "ERROR", type: "Load Failure", page: ctx.name, viewport: ctx.viewport, detail: e.message });
      }

      await context.close();
    }
  }

  await browser.close();

  // Summary
  console.log("\n========== AUDIT SUMMARY ==========");
  const bySeverity = {};
  report.forEach((i) => {
    bySeverity[i.severity] = (bySeverity[i.severity] || 0) + 1;
  });
  console.log(`Total issues: ${report.length}`);
  console.log(bySeverity);

  fs.writeFileSync(path.join(OUT_DIR, "report.json"), JSON.stringify(report, null, 2));
  console.log(`\nReport: ${path.join(OUT_DIR, "report.json")}`);
  console.log(`Screenshots: ${OUT_DIR}/`);
})();
