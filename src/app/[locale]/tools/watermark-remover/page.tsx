import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { tools, generateToolMetadata } from "@/lib/tools";
import WatermarkRemoverClient from "./WatermarkRemoverClient";

const TOOL_ID = "watermark-remover";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return generateToolMetadata(TOOL_ID, locale, dict as Record<string, unknown>);
}

export default async function WatermarkRemoverPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return <WatermarkRemoverClient locale={locale as Locale} dict={dict} />;
}
