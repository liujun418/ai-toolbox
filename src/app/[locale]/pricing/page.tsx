import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import PricingClient from "./PricingClient";

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return <PricingClient dict={dict} />;
}
