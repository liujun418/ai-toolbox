import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import PdfToWordClient from "./PdfToWordClient";

const TOOL_ID = "pdf-to-word";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const tools = (dict as any)?.tools?.[TOOL_ID] || {};
  const title = `${tools.name || "PDF to Word"} — AI ToolBox Online`;
  const description = tools.description || "Convert PDF documents to editable Word files.";
  const url = `https://ai.toolboxonline.club/${locale}/tools/${TOOL_ID}`;
  return { title, description, openGraph: { title, description, url, type: "website" }, twitter: { card: "summary_large_image", title, description } };
}

export default async function PdfToWordPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return <PdfToWordClient locale={locale as Locale} dict={dict} />;
}
