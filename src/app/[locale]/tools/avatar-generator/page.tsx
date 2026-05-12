import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import AvatarGeneratorClient from "./AvatarGeneratorClient";

const TOOL_ID = "avatar-generator";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const tools = (dict as any)?.tools?.[TOOL_ID] || {};
  const title = `${tools.name || "AI Avatar Generator"} — AI ToolBox Online`;
  const description = tools.description || "Transform photos into cartoon, anime, or professional avatars.";
  const url = `https://ai.toolboxonline.club/${locale}/tools/${TOOL_ID}`;
  return { title, description, openGraph: { title, description, url, type: "website" }, twitter: { card: "summary_large_image", title, description } };
}

export default async function AvatarGeneratorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return <AvatarGeneratorClient locale={locale as Locale} dict={dict} />;
}
