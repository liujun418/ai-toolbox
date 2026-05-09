"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { toolsApi } from "@/lib/api";
import { useUsageTracker } from "@/hooks/useUsageTracker";
import Link from "next/link";

const modes = [
  { id: "polish", label: "Polish", icon: "✨", desc: "Improve grammar and clarity" },
  { id: "rewrite", label: "Rewrite", icon: "🔄", desc: "Rephrase with same meaning" },
  { id: "shorten", label: "Shorten", icon: "✂️", desc: "Make it more concise" },
  { id: "expand", label: "Expand", icon: "📝", desc: "Add more detail" },
];

export default function TextPolishPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [text, setText] = useState("");
  const [selectedMode, setSelectedMode] = useState("polish");
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [result, setResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [creditsUsed, setCreditsUsed] = useState(0);

  useUsageTracker({
    toolId: "text-polish",
    toolName: "Text Polish",
    icon: "✨",
    creditsUsed,
    trigger: creditsUsed > 0,
  });

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-16 text-center text-zinc-400">Loading...</div>;
  if (!user) {
    router.push("/login");
    return null;
  }

  async function handlePolish() {
    if (!text.trim()) return;
    setStatus("processing");
    setErrorMsg("");

    const prompt = `Mode: ${selectedMode}. Text: ${text}`;

    // Create a text file from the input
    const blob = new Blob([text], { type: "text/plain" });
    const file = new File([blob], "input.txt", { type: "text/plain" });

    try {
      const data = await toolsApi.uploadFile("text-polish", file, prompt);
      // Try to read the result as text if it's a text file
      setStatus("done");
      setResult(data.output_file_url);
      setCreditsUsed(data.credits_used || 3);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <span>Text Polish</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          ✨ Text Polish & Rewrite
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Polish, rewrite, shorten, or expand your text with AI. Costs <span className="font-semibold text-blue-600">3 credits</span>.
        </p>
      </div>

      {/* Input Area */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {/* Mode Selection */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Mode</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMode(m.id)}
                className={`rounded-lg border p-3 text-center transition-all ${
                  selectedMode === m.id
                    ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                }`}
              >
                <span className="block text-xl">{m.icon}</span>
                <span className="mt-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300">{m.label}</span>
                <span className="mt-0.5 block text-xs text-zinc-400">{m.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Input */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="input-text" className="mb-2 block text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Original Text
            </label>
            <textarea
              id="input-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm leading-relaxed dark:border-zinc-700 dark:bg-zinc-800"
              placeholder="Paste or type your text here..."
            />
            <p className="mt-1 text-xs text-zinc-400">{text.length} characters</p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Result
            </label>
            <div className="flex min-h-[240px] w-full items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
              {status === "done" && result ? (
                <div className="w-full overflow-auto">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-900 dark:text-zinc-100">
                    {result}
                  </pre>
                </div>
              ) : status === "processing" ? (
                <div className="text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                  <p className="mt-2 text-sm text-zinc-500">Processing text...</p>
                </div>
              ) : status === "error" ? (
                <p className="text-sm text-red-500">{errorMsg}</p>
              ) : (
                <p className="text-sm text-zinc-400">Processed text will appear here</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {status === "idle" && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={handlePolish}
              disabled={!text.trim()}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {modes.find((m) => m.id === selectedMode)?.label} Text (3 credits)
            </button>
            <button
              onClick={() => setText("")}
              className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
            >
              Clear
            </button>
          </div>
        )}

        {/* Download / Copy */}
        {status === "done" && result && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => { navigator.clipboard.writeText(result); }}
              className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
            >
              Copy to Clipboard
            </button>
            <a
              href={result}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
            >
              Download Result
            </a>
            <button
              onClick={() => { setText(""); setResult(null); setStatus("idle"); }}
              className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
            >
              Try Another Text
            </button>
          </div>
        )}

        {/* Error retry */}
        {status === "error" && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={handlePolish}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Try Again
            </button>
            <button
              onClick={() => { setErrorMsg(""); setStatus("idle"); }}
              className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
