"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function AdminRootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        router.push("/");
      } else {
        router.push("/admin/dashboard");
      }
    }
  }, [user, loading, router]);

  return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
}
