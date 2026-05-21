import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return <SettingsClient dict={dict} />;
}
