import { getDictionary, isValidLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import ResetPasswordClient from "./ResetPasswordClient";

export default async function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const { token } = await searchParams;
  return <ResetPasswordClient locale={locale} dict={dict} token={token || ""} />;
}
