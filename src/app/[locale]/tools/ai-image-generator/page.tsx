import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import AiImageGeneratorClient from "./AiImageGeneratorClient";

const TOOL_ID = "ai-image-generator";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const tools = (dict as any)?.tools?.[TOOL_ID] || {};
  const title = `${tools.name || "AI Image Generator"} — AI ToolBox Online`;
  const description = tools.description || "Turn text into stunning AI-generated images. No watermark.";
  const url = `https://ai.toolboxonline.club/${locale}/tools/${TOOL_ID}`;
  return { title, description, openGraph: { title, description, url, type: "website" }, twitter: { card: "summary_large_image", title, description } };
}

export default async function AiImageGeneratorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return <AiImageGeneratorClient locale={locale as Locale} dict={dict} />;
}
