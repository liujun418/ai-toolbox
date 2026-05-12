import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import StyleTransferClient from "./StyleTransferClient";

const TOOL_ID = "style-transfer";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const tools = (dict as any)?.tools?.[TOOL_ID] || {};
  const title = `${tools.name || "Image Style Transfer"} — AI ToolBox Online`;
  const description = tools.description || "Transform photos into oil paintings, watercolors, anime art.";
  const url = `https://ai.toolboxonline.club/${locale}/tools/${TOOL_ID}`;
  return { title, description, openGraph: { title, description, url, type: "website" }, twitter: { card: "summary_large_image", title, description } };
}

export default async function StyleTransferPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return <StyleTransferClient locale={locale as Locale} dict={dict} />;
}
