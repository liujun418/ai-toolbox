"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { locales, defaultLocale } from "@/lib/i18n";

interface HeaderProps {
  locale?: string;
  dict?: Record<string, unknown>;
}

export function Header({ locale = defaultLocale, dict }: HeaderProps) {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [dark, setDark] = useState(false);

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
