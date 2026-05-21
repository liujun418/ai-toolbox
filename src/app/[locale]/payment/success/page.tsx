import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import PaymentSuccessClient from "./PaymentSuccessClient";

export default async function PaymentSuccessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return <PaymentSuccessClient locale={locale} dict={dict} />;
}
