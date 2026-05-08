import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Sign up</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Get 5 free credits to start. No credit card required.</p>
      <form className="mt-8 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
          <input type="text" id="name" className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" placeholder="John Doe" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
          <input type="email" id="email" className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
          <input type="password" id="password" className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" placeholder="••••••••" />
        </div>
        <button type="submit" className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900">
          Create account
        </button>
      </form>
      <div className="mt-4 text-center">
        <button className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
          Continue with Google
        </button>
      </div>
      <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">Log in</Link>
      </p>
    </div>
  );
}
