"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { adminApi, type SuggestionItem } from "@/lib/api";
import { getLocaleFromPathname } from "@/lib/locale";

export default function AdminSuggestionsPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSuggestions = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.listSuggestions();
      setSuggestions(data.suggestions);
    } catch (e: any) {
      setError(e.message || "Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSuggestions(); }, []);

  const handleDelete = async (id: string) => {
    try {
      await adminApi.deleteSuggestion(id);
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
    } catch (e: any) {
      setError(e.message || "Failed to delete");
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await adminApi.markSuggestionRead(id);
      setSuggestions((prev) => prev.map((s) => s.id === id ? { ...s, read: true } : s));
    } catch {}
  };

  const unreadCount = suggestions.filter((s) => !s.read).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Suggestions</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {unreadCount} unread · {suggestions.length} total
          </p>
        </div>
        <button onClick={fetchSuggestions} disabled={loading}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{error}</div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-2 h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-3 w-24 rounded bg-zinc-100 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      ) : suggestions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No suggestions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions.map((s) => (
            <div key={s.id}
              className={`rounded-xl border bg-white p-4 transition-colors dark:bg-zinc-900 ${
                s.read ? "border-zinc-200 dark:border-zinc-800" : "border-blue-300 bg-blue-50/30 dark:border-blue-700 dark:bg-blue-950/10"
              }`}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-zinc-800 dark:text-zinc-200">{s.text}</p>
                <div className="flex shrink-0 items-center gap-2">
                  {!s.read && (
                    <button onClick={() => handleMarkRead(s.id)}
                      className="rounded-lg border border-blue-300 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20">
                      Mark Read
                    </button>
                  )}
                  <button onClick={() => handleDelete(s.id)}
                    className="rounded-lg border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20">
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                {new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
