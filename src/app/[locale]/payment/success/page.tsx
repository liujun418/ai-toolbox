"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getLocaleFromPathname } from "@/lib/locale";

export default function PaymentSuccessPage() {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(`/${locale}/dashboard`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router, locale]);

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
      <div className="mb-6 text-6xl">✅</div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Payment Successful!</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        Your credits have been added to your account.
      </p>
      {user && (
        <p className="mt-2 text-lg font-semibold text-blue-600">
          {user.credits} credits available
        </p>
      )}
      <Link
        href={`/${locale}/dashboard`}
        className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Go to Dashboard ({countdown}s)
      </Link>
    </div>
  );
}
