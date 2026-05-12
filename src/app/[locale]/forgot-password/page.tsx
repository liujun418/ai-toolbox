import { getDictionary, isValidLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import ForgotPasswordClient from "./ForgotPasswordClient";

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return <ForgotPasswordClient locale={locale} dict={dict} />;
}
