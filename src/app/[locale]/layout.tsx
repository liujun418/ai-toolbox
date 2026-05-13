import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/lib/auth-context";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { locales, defaultLocale, isValidLocale, localeDir, getDictionary } from "@/lib/i18n";
import { Geist, Geist_Mono } from "next/font/google";
import { Noto_Sans_Arabic } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const notoSansArabic = Noto_Sans_Arabic({ variable: "--font-noto-sans-arabic", subsets: ["arabic"], display: "swap" });

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
        "x-default": `${SITE_URL}/en`,
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
    ? `${geistSans.variable} ${geistMono.variable} ${notoSansArabic.variable}`
    : `${geistSans.variable} ${geistMono.variable}`;

  return (
    <html suppressHydrationWarning dir={dir} lang={locale} className={fontClass}>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/favicon-512.png" />
      </head>
      <body className="flex min-h-dvh flex-col overflow-x-hidden bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <AuthProvider>
          <Header locale={locale} dict={dict} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} dict={dict} />
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
