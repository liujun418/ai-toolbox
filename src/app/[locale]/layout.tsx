import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { Noto_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import "@/app/globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/lib/auth-context";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { locales, defaultLocale, isValidLocale, localeDir, getDictionary } from "@/lib/i18n";

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
});

const SITE_URL = "https://ai.toolboxonline.club";
const SITE_NAME = "AI ToolBox Online";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const dict = await getDictionary(locale);
  const home = (dict as any).home || {};

  const localeMap: Record<string, string> = { en: "en_US", es: "es_ES", ar: "ar_SA" };

  return {
    title: `${SITE_NAME} — ${home.heroTitle || "Free AI Tools for Every Task"}`,
    description: home.heroDescription || "Free online AI tools for photo editing, PDF conversion, and more.",
    openGraph: {
      type: "website",
      locale: localeMap[locale] || "en_US",
      url: `${SITE_URL}/${locale}`,
      siteName: SITE_NAME,
      title: `${SITE_NAME} — ${home.heroTitle || "Free AI Tools"}`,
      description: home.heroDescription || "Free online AI tools.",
      images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} — ${home.heroTitle || "Free AI Tools"}`,
      description: home.heroDescription || "Free online AI tools.",
      images: [`${SITE_URL}/og-default.png`],
    },
    alternates: {
      languages: {
        en: `${SITE_URL}/en`,
        es: `${SITE_URL}/es`,
        ar: `${SITE_URL}/ar`,
      },
    },
  };
}

export default async function LocaleLayout({
  params,
  children,
}: {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const dir = localeDir[locale];
  const fontClass = locale === "ar"
    ? `--font-geist-sans --font-geist-mono ${notoSansArabic.variable}`
    : "--font-geist-sans --font-geist-mono";

  return (
    <div className={`h-full antialiased ${fontClass}`}>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-B17KH1S3VM"
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-B17KH1S3VM');
        `,
      }} />
      <AuthProvider>
        <Header locale={locale} dict={dict} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} dict={dict} />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
      </AuthProvider>
    </div>
  );
}
