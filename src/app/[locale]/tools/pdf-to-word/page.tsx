import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { tools } from "@/lib/tools";
import PdfToWordClient from "./PdfToWordClient";

const TOOL_ID = "pdf-to-word";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const tool = tools.find((t) => t.id === TOOL_ID);
  const localeTools = (dict as any)?.tools?.[TOOL_ID] || {};
  const name = localeTools.name || tool?.name || "";
  const desc = localeTools.description || tool?.description || "";
  const title = `${name} — AI ToolBox Online`;
  const url = `https://ai.toolboxonline.club/${locale}/tools/${TOOL_ID}`;
  return { title, description: desc, openGraph: { title, description: desc, url, type: "website" }, twitter: { card: "summary_large_image", title, description: desc } };
}

export default async function PdfToWordPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return <PdfToWordClient locale={locale as Locale} dict={dict} />;
}
