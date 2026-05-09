import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
      <div className="mb-4 text-8xl font-bold text-zinc-200 dark:text-zinc-800">404</div>
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Page Not Found</h1>
      <p className="mt-3 text-zinc-500 dark:text-zinc-400">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
        >
          Go Home
        </Link>
        <Link
          href="/pricing"
          className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          View Pricing
        </Link>
      </div>
    </div>
  );
}
