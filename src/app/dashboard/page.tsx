"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const tools = [
  { id: "avatar-generator", name: "AI Avatar Generator", icon: "🎨", href: "/tools/avatar-generator" },
  { id: "background-remover", name: "Background Remover", icon: "✂️", href: "/tools/background-remover" },
  { id: "watermark-remover", name: "Watermark Remover", icon: "🧹", href: "/tools/watermark-remover" },
  { id: "photo-restorer", name: "Photo Restorer", icon: "📷", href: "/tools/photo-restorer" },
  { id: "pdf-to-word", name: "PDF to Word", icon: "📄", href: "/tools/pdf-to-word" },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  if (loading) return <div className="mx-auto max-w-6xl px-4 py-16 text-center text-zinc-400">Loading...</div>;
  if (!user) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Welcome back, {user.name || user.email}
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          You have <span className="font-semibold text-blue-600">{user.credits} credits</span> remaining.
        </p>
        <Link
          href="/pricing"
          className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          Buy more credits →
        </Link>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Your Tools</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            <span className="mb-3 block text-3xl">{tool.icon}</span>
            <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              {tool.name}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
