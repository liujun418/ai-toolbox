import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import TextPolishClient from "./TextPolishClient";

const TOOL_ID = "text-polish";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const tools = (dict as any)?.tools?.[TOOL_ID] || {};
  const title = `${tools.name || "Text Polish & Rewrite"} — AI ToolBox Online`;
  const description = tools.description || "Polish, rewrite, shorten, or expand text with AI.";
  const url = `https://ai.toolboxonline.club/${locale}/tools/${TOOL_ID}`;
  return { title, description, openGraph: { title, description, url, type: "website" }, twitter: { card: "summary_large_image", title, description } };
}

export default async function TextPolishPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return <TextPolishClient locale={locale as Locale} dict={dict} />;
}
