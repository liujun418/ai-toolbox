import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="text-lg">✨</span>
            <span>© {new Date().getFullYear()} AI ToolBox Online</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
            <a
              href="https://www.toolboxonline.club"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 dark:hover:text-white"
            >
              Free Tools →
            </a>
            <Link href="/pricing" className="hover:text-zinc-900 dark:hover:text-white">
              Pricing
            </Link>
            <Link href="/about" className="hover:text-zinc-900 dark:hover:text-white">
              About
            </Link>
            <Link href="/contact" className="hover:text-zinc-900 dark:hover:text-white">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-white">
              Terms
            </Link>
            <a
              href="https://www.toolboxonline.club"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 dark:hover:text-white"
            >
              Free Tools →
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
