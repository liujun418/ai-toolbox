import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Log in</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Sign in to access your AI tools and credits.</p>
      <form className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
          <input type="email" id="email" className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
          <input type="password" id="password" className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" placeholder="••••••••" />
        </div>
        <button type="submit" className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900">
          Log in
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Don't have an account?{" "}
        <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">Sign up</Link>
      </p>
    </div>
  );
}
