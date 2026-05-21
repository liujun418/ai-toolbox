import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import SignupClient from "./SignupClient";

export default async function SignupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return <SignupClient dict={dict} />;
}
