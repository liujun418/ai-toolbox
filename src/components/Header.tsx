"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { locales, defaultLocale, localeNames } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";

interface HeaderProps {
  locale?: string;
  dict?: Record<string, unknown>;
}

export function Header({ locale = defaultLocale, dict }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [dark, setDark] = useState(false);
  const [showLang, setShowLang] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDark((d) => !d);
  };

  const switchLocale = (newLocale: Locale) => {
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && ["en", "es", "ar"].includes(segments[0])) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    router.push("/" + segments.join("/"));
  };

  const t = (dict as any)?.nav || {};

  const navItems = [
    { label: t.tools || "Tools", href: `/${locale}` },
    { label: t.pricing || "Pricing", href: `/${locale}/pricing` },
    { label: t.about || "About", href: `/${locale}/about` },
  ];

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href={`/${locale}`} className="flex items-center">
          {!dark ? (
            <Image
              src="/logo.png"
              alt="AI ToolBox"
              width={180}
              height={40}
              className="h-9 w-auto"
              priority
            />
          ) : (
            <Image
              src="/logo-dark.png"
              alt="AI ToolBox"
              width={180}
              height={40}
              className="h-9 w-auto"
              priority
            />
          )}
        </Link>

        <nav className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded px-2 py-1 transition-colors hover:text-zinc-900 dark:hover:text-white ${
                pathname === item.href
                  ? "font-semibold text-zinc-900 dark:text-white"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div className="ms-2 flex items-center gap-2 border-s border-zinc-200 ps-4 dark:border-zinc-800">
            <a
              href="https://www.toolboxonline.club"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
            >
              {t.freeTools || "Free Tools →"}
            </a>
            {loading ? (
              <span className="text-sm text-zinc-400">{t.loading || "..."}</span>
            ) : user ? (
              <>
                <Link
                  href={`/${locale}/dashboard`}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  {user.credits} {t.credits || "credits"}
                </Link>
                <button
                  onClick={logout}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  {t.logout || "Log out"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href={`/${locale}/login`}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  {t.login || "Log in"}
                </Link>
                <Link
                  href={`/${locale}/signup`}
                  className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  {t.signup || "Sign up"}
                </Link>
              </>
            )}
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLang(!showLang)}
                className="rounded px-2 py-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                aria-label="Switch language"
              >
                {(localeNames as Record<string, string>)[locale as string] || "English"}
              </button>
              {showLang && (
                <div className="absolute right-0 z-50 mt-1 min-w-[120px] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                  {locales.map((l) => (
                    <button
                      key={l}
                      onClick={() => { switchLocale(l); setShowLang(false); }}
                      className={`block w-full px-4 py-1.5 text-left text-sm ${
                        l === locale ? "font-semibold text-zinc-900 dark:text-white" : "text-zinc-600 dark:text-zinc-400"
                      } hover:bg-zinc-100 dark:hover:bg-zinc-800`}
                    >
                      {(localeNames as Record<string, string>)[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={toggleDark}
              className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label={t.toggleDark || "Toggle dark mode"}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
