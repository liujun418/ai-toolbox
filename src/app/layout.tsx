import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Noto_Sans_Arabic } from "next/font/google";
import { redirect } from "next/navigation";
import { locales, isValidLocale, localeDir, getDictionary } from "@/lib/i18n";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: _params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  const params = await _params;
  const locale = params?.locale && isValidLocale(params.locale) ? params.locale : "en";
  const dir = isValidLocale(locale) ? localeDir[locale] : "ltr";

  const fontClass = locale === "ar"
    ? `${geistSans.variable} ${geistMono.variable} ${notoSansArabic.variable}`
    : `${geistSans.variable} ${geistMono.variable}`;

  return (
    <html
      suppressHydrationWarning
      dir={dir}
      lang={locale}
      className={fontClass}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        {children}
      </body>
    </html>
  );
}
