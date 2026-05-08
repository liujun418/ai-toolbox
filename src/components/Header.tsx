"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { label: "Tools", href: "/" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
            AI ToolBox
          </span>
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

          <a
            href="https://www.toolboxonline.club"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 sm:inline"
          >
            Free Tools →
          </a>

          <div className="ms-2 flex items-center gap-2 border-s border-zinc-200 ps-4 dark:border-zinc-800">
            <Link
              href="/login"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Sign up
            </Link>
            <button
              onClick={() =>
                document.documentElement.classList.toggle("dark")
              }
              className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Toggle dark mode"
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
