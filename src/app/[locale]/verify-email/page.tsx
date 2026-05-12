"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { authApi } from "@/lib/api";
import { getLocaleFromPathname } from "@/lib/locale";

export default function VerifyEmailPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = getLocaleFromPathname(pathname);
  const token = searchParams.get("token") || "";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Missing verification token");
      setLoading(false);
      return;
    }
    authApi.verifyEmail(token)
      .then((res) => {
        setEmail(res.email);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Verification failed");
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6 text-center">
        <p className="text-lg text-zinc-500">Verifying your email...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Verification Failed
        </h1>
        <p className="mt-4 text-sm text-red-600">{error}</p>
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          The verification link may have expired.{" "}
          <Link href={`/${locale}/login`} className="font-medium text-blue-600 hover:text-blue-500">
            Log in to resend
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 text-center">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
        Email Verified
      </h1>
      <p className="mt-4 text-sm text-green-600 dark:text-green-400">
        {email} has been verified successfully.
      </p>
      <p className="mt-6">
        <Link href={`/${locale}`} className="text-sm font-medium text-blue-600 hover:text-blue-500">
          Go to Home
        </Link>
      </p>
    </div>
  );
}
