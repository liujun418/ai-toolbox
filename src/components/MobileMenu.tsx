"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { locales, defaultLocale, localeNames } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

interface MobileMenuProps {
  locale?: string;
  dict?: Record<string, unknown>;
}

export default function MobileMenu({ locale = defaultLocale, dict }: MobileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
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

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const t = (dict as any)?.nav || {};
  const isRTL = locale === "ar";

  const navItems = [
    { label: t.tools || "Tools", href: `/${locale}` },
    { label: t.pricing || "Pricing", href: `/${locale}/pricing` },
    { label: t.about || "About", href: `/${locale}/about` },
  ];

  return (
    <>
      {/* Hamburger button — visible only on mobile */}
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 md:hidden"
        aria-label="Open menu"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed inset-y-0 z-50 w-72 transform bg-white shadow-xl transition-transform duration-300 ease-in-out dark:bg-zinc-950 md:hidden ${
          isRTL ? "left-0" : "right-0"
        } ${open ? "translate-x-0" : isRTL ? "-translate-x-full" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
          <Image
            src="/logo.png"
            alt="AI ToolBox"
            width={120}
            height={27}
            className="h-7 w-auto"
          />
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Close menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 px-4 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://www.toolboxonline.club"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-50 hover:text-blue-600 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-blue-400"
          >
            {t.freeTools || "Free Tools →"}
          </a>
        </nav>

        <div className="mx-4 border-t border-zinc-200 dark:border-zinc-800" />

        {/* Auth section */}
        <div className="px-4 py-4">
          {loading ? (
            <span className="text-sm text-zinc-400">{t.loading || "..."}</span>
          ) : user ? (
            <div className="space-y-3">
              <div className="rounded-lg bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-900">
                <div className="font-medium text-zinc-900 dark:text-white">
                  {user.name || user.email}
                </div>
                <div className="mt-1 text-zinc-500 dark:text-zinc-400">
                  {user.credits.toFixed(1)} {t.credits || "credits"}
                </div>
              </div>
              <Link
                href={`/${locale}/settings`}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {t.settings || "Settings"}
              </Link>
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {t.logout || "Log out"}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href={`/${locale}/login`}
                className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {t.login || "Log in"}
              </Link>
              <Link
                href={`/${locale}/signup`}
                className="block w-full rounded-lg bg-zinc-900 px-3 py-2 text-center text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {t.signup || "Sign up"}
              </Link>
            </div>
          )}
        </div>

        <div className="mx-4 border-t border-zinc-200 dark:border-zinc-800" />

        {/* Footer: Language + Dark mode */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="relative">
            <button
              onClick={() => setShowLang(!showLang)}
              className="rounded-lg px-3 py-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              {(localeNames as Record<string, string>)[locale as string] || "English"}
            </button>
            {showLang && (
              <div
                className={`absolute bottom-full z-50 mb-1 min-w-[120px] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900 ${
                  isRTL ? "right-0" : "left-0"
                }`}
              >
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
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Toggle dark mode"
          >
            {dark ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
