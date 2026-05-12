"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { locales, defaultLocale, localeNames } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import MobileMenu from "@/components/MobileMenu";

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
    <>
      {/* Email verification banner */}
      {user && !user.email_verified && pathname !== `/${locale}/verify-email` && (
        <div className="flex items-center justify-center gap-3 bg-yellow-50 px-4 py-2 text-sm text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300">
          <span>Please verify your email address for full account access.</span>
          <Link href={`/${locale}/settings`} className="font-medium underline hover:no-underline">
            Settings
          </Link>
        </div>
      )}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href={`/${locale}`} className="flex shrink-0 items-center">
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

        <nav className="hidden items-center gap-4 text-sm text-zinc-600 md:flex dark:text-zinc-400">
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
              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {t.freeTools || "Free Tools"}
            </a>
            {loading ? (
              <span className="text-sm text-zinc-400">{t.loading || "..."}</span>
            ) : user ? (
              <>
                <span
                  className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5 text-sm font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {user.credits.toFixed(0)}
                </span>
                <Link
                  href={`/${locale}/settings`}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m-8 4a7 7 0 110-14 7 7 0 010 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12H3" />
                  </svg>
                  {t.logout || "Log out"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href={`/${locale}/login`}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m8 4a7 7 0 110-14 7 7 0 010 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3" />
                  </svg>
                  {t.login || "Log in"}
                </Link>
                <Link
                  href={`/${locale}/signup`}
                  className="flex items-center gap-1 rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-6h3m-3 0h-3m-7-1v7m0 0v2m-1.5-4h3m2.5 2v2m-2-2v-2m-2 2v-2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 9V6a3 3 0 00-6 0v3" />
                  </svg>
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
                <svg className="ms-1 inline-block h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
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

        {/* Mobile menu */}
        <MobileMenu locale={locale} dict={dict} />
      </div>
    </header>
    </>
  );
}
