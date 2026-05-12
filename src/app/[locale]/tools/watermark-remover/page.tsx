import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import WatermarkRemoverClient from "./WatermarkRemoverClient";

const TOOL_ID = "watermark-remover";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const tools = (dict as any)?.tools?.[TOOL_ID] || {};
  const title = `${tools.name || "Watermark Remover"} — AI ToolBox Online`;
  const description = tools.description || "Erase watermarks, logos, and text from images.";
  const url = `https://ai.toolboxonline.club/${locale}/tools/${TOOL_ID}`;
  return { title, description, openGraph: { title, description, url, type: "website" }, twitter: { card: "summary_large_image", title, description } };
}

export default async function WatermarkRemoverPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return <WatermarkRemoverClient locale={locale as Locale} dict={dict} />;
}
