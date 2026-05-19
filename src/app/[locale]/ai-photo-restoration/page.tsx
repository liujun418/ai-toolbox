import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { aiTopics } from "@/lib/topics";
import TopicPage from "@/components/TopicPage";

const TOPIC_ID = "ai-photo-restoration";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const topic = aiTopics.find((t) => t.id === TOPIC_ID);
  const title = `${topic?.title || "AI Photo Restoration"} — AI ToolBox Online`;
  const desc = topic?.description || "Free AI photo restoration tools online.";
  const url = `https://ai.toolboxonline.club/${locale}/${TOPIC_ID}`;
  return { title, description: desc, openGraph: { title, description: desc, url, type: "website" as const }, twitter: { card: "summary_large_image" as const, title, description: desc } };
}

export default async function TopicPageWrapper({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const topic = aiTopics.find((t) => t.id === TOPIC_ID)!;
  return <TopicPage topic={topic} locale={locale} dict={dict as Record<string, unknown>} />;
}
