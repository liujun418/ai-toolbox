"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getLocaleFromPathname } from "@/lib/locale";

const tools = [
  { id: "ai-image-generator", name: "AI Image Generator", icon: "🎨" },
  { id: "avatar-generator", name: "AI Avatar Generator", icon: "🤖" },
  { id: "background-remover", name: "Background Remover", icon: "✂️" },
  { id: "watermark-remover", name: "Watermark Remover", icon: "🧹" },
  { id: "photo-restorer", name: "Photo Restorer", icon: "📷" },
  { id: "pdf-to-word", name: "PDF to Word", icon: "📄" },
  { id: "image-upscaler", name: "Image Upscaler", icon: "🔍" },
  { id: "style-transfer", name: "Style Transfer", icon: "🖼️" },
  { id: "text-polish", name: "Text Polish", icon: "✨" },
];

interface UsageEntry {
  toolId: string;
  toolName: string;
  icon: string;
  date: string;
  creditsUsed: number;
}

function getUsageHistory(): UsageEntry[] {
  try {
    const raw = localStorage.getItem("usage_history");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getTotalCreditsUsed(history: UsageEntry[]): number {
  return history.reduce((sum, entry) => sum + entry.creditsUsed, 0);
}

function getUniqueToolsUsed(history: UsageEntry[]): number {
  return new Set(history.map((e) => e.toolId)).size;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const [history, setHistory] = useState<UsageEntry[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push(`/${locale}/login`);
  }, [loading, user, router, locale]);

  useEffect(() => {
    setHistory(getUsageHistory());
  }, []);

  if (loading) return <div className="mx-auto max-w-6xl px-4 py-16 text-center text-zinc-400">Loading...</div>;
  if (!user) return null;

  const totalUsed = getTotalCreditsUsed(history);
  const uniqueTools = getUniqueToolsUsed(history);
  const recentHistory = history.slice(0, 10);

  const toolCredits: Record<string, number> = {
    "ai-image-generator": 1,
    "avatar-generator": 5,
    "background-remover": 2,
    "watermark-remover": 3,
    "photo-restorer": 5,
    "pdf-to-word": 0,
    "image-upscaler": 2,
    "style-transfer": 4,
    "text-polish": 3,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Welcome back, {user.name || user.email}
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          You have <span className="font-semibold text-blue-600">{user.credits} credits</span> remaining.
        </p>
        <Link
          href={`/${locale}/pricing`}
          className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          Buy more credits →
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Credits Used (All Time)</p>
          <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-white">{totalUsed}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Tools Used</p>
          <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-white">{uniqueTools} / {tools.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Member Since</p>
          <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-white">
            {new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Your Tools</h2>
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const toolUsage = history.filter((e) => e.toolId === tool.id).length;
          return (
            <Link
              key={tool.id}
              href={`/${locale}/tools/${tool.id}`}
              className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{tool.icon}</span>
                {toolUsage > 0 && (
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    Used {toolUsage}x
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                {tool.name}
              </h3>
              <p className="mt-1 text-xs text-zinc-400">{toolCredits[tool.id]} credits per use</p>
            </Link>
          );
        })}
      </div>

      {/* Usage History */}
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Recent Activity</h2>
      {recentHistory.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No activity yet. Try a tool to get started!
          </p>
          <Link
            href={`/${locale}`}
            className="mt-3 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
          >
            Browse Tools
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                <tr>
                  <th className="px-4 py-3 text-start font-medium text-zinc-500 dark:text-zinc-400">Tool</th>
                  <th className="px-4 py-3 text-start font-medium text-zinc-500 dark:text-zinc-400">Date</th>
                  <th className="px-4 py-3 text-end font-medium text-zinc-500 dark:text-zinc-400">Credits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {recentHistory.map((entry, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3">
                      <span className="mr-2">{entry.icon}</span>
                      {entry.toolName}
                    </td>
                    <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                      {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-3 text-end font-medium text-zinc-700 dark:text-zinc-300">
                      -{entry.creditsUsed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
