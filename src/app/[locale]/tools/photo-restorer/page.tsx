import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import PhotoRestorerClient from "./PhotoRestorerClient";

const TOOL_ID = "photo-restorer";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const tools = (dict as any)?.tools?.[TOOL_ID] || {};
  const title = `${tools.name || "Photo Restorer"} — AI ToolBox Online`;
  const description = tools.description || "Restore and colorize old, blurry, or damaged photos.";
  const url = `https://ai.toolboxonline.club/${locale}/tools/${TOOL_ID}`;
  return { title, description, openGraph: { title, description, url, type: "website" }, twitter: { card: "summary_large_image", title, description } };
}

export default async function PhotoRestorerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return <PhotoRestorerClient locale={locale as Locale} dict={dict} />;
}
