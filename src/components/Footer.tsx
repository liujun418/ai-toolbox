"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

interface FooterProps {
  locale?: string;
  dict?: Record<string, unknown>;
}

export function Footer({ locale = "en", dict }: FooterProps) {
  const t = (dict as any)?.footer || {};
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="text-lg">✨</span>
            <span>© {new Date().getFullYear()} {t.copyright || "AI ToolBox Online. All rights reserved."}</span>
          </div>

          <div className="flex flex-col items-center gap-2 sm:items-end">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 sm:gap-6">
              <a
                href="https://www.toolboxonline.club"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-900 dark:hover:text-white"
              >
                {t.freeTools || "Free Tools →"}
              </a>
              <Link href={`/${locale}/pricing`} className="hover:text-zinc-900 dark:hover:text-white">
                {t.pricing || "Pricing"}
              </Link>
              <Link href={`/${locale}/about`} className="hover:text-zinc-900 dark:hover:text-white">
                {t.about || "About"}
              </Link>
              <Link href={`/${locale}/contact`} className="hover:text-zinc-900 dark:hover:text-white">
                {t.contact || "Contact"}
              </Link>
              <Link href={`/${locale}/privacy`} className="hover:text-zinc-900 dark:hover:text-white">
                {t.privacy || "Privacy"}
              </Link>
              <Link href={`/${locale}/terms`} className="hover:text-zinc-900 dark:hover:text-white">
                {t.terms || "Terms"}
              </Link>
              {isAdmin && (
                <Link href={`/${locale}/admin`} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                  {t.admin || "Admin"}
                </Link>
              )}
            </div>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              Contact: <a href={`mailto:${t.email || "jzerov@live.com"}`} className="hover:text-blue-600">{t.email || "jzerov@live.com"}</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
