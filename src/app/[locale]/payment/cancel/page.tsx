import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import PaymentCancelClient from "./PaymentCancelClient";

export default async function PaymentCancelPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return <PaymentCancelClient locale={locale} dict={dict} />;
}
