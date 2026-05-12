import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import ImageUpscalerClient from "./ImageUpscalerClient";

const TOOL_ID = "image-upscaler";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const tools = (dict as any)?.tools?.[TOOL_ID] || {};
  const title = `${tools.name || "Image Upscaler"} — AI ToolBox Online`;
  const description = tools.description || "Enhance image resolution with AI super-resolution.";
  const url = `https://ai.toolboxonline.club/${locale}/tools/${TOOL_ID}`;
  return { title, description, openGraph: { title, description, url, type: "website" }, twitter: { card: "summary_large_image", title, description } };
}

export default async function ImageUpscalerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return <ImageUpscalerClient locale={locale as Locale} dict={dict} />;
}
