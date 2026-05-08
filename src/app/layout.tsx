import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI ToolBox Online — Free AI Tools for Photo, PDF & More",
  description:
    "Free online AI tools: remove backgrounds, generate avatars, remove watermarks, restore old photos, convert PDF to Word. No signup required.",
  keywords: [
    "ai tools online",
    "background remover",
    "ai avatar generator",
    "watermark remover",
    "photo restorer",
    "pdf to word converter",
    "free ai tools",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ai.toolboxonline.club",
    title: "AI ToolBox Online — Free AI Tools for Photo, PDF & More",
    description:
      "Free online AI tools: remove backgrounds, generate avatars, remove watermarks, restore old photos, convert PDF to Word.",
    siteName: "AI ToolBox Online",
    images: [
      {
        url: "https://ai.toolboxonline.club/og-default.png",
        width: 1200,
        height: 630,
        alt: "AI ToolBox Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI ToolBox Online — Free AI Tools for Photo, PDF & More",
    description:
      "Free online AI tools: remove backgrounds, generate avatars, remove watermarks, restore old photos, convert PDF to Word.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
