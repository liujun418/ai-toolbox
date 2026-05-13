"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { toolsApi } from "@/lib/api";
import { useUsageTracker } from "@/hooks/useUsageTracker";
import { CreditConfirmDialog, CreditsUsedToast, LoginPromptDialog } from "@/components/CreditGuard";
import type { Locale } from "@/lib/i18n";

import { getCreditCost } from "@/lib/creditCosts";
const TOOL_ID = "text-polish";

const modeIds = ["polish", "rewrite", "shorten", "expand"] as const;

export default function TextPolishClient({ locale = "en" as Locale, dict }: { locale?: Locale; dict?: Record<string, unknown> }) {
  const CREDIT_COST = getCreditCost(TOOL_ID);
  const { user, loading } = useAuth();
  const [text, setText] = useState("");
  const [selectedMode, setSelectedMode] = useState("polish");
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [result, setResult] = useState<string | null>(null);
  const [resultContent, setResultContent] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const t = (dict as any)?.textPolish || {};
  const tp = (dict as any)?.toolPage || {};
  const nav = (dict as any)?.nav || {};
  const modes = (dict as any)?.textPolish?.modes || {};

  useUsageTracker({ toolId: TOOL_ID, toolName: t.title || "Text Polish", icon: "✨", creditsUsed, trigger: creditsUsed > 0 });

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-16 text-center text-zinc-400">{tp.loading || "Loading..."}</div>;

  const showLoginPrompt = !user && showConfirm;

  function handleUploadClick() {
    if (!text.trim()) return;
    setShowConfirm(true);
  }

  async function handleUpload() {
    if (!text.trim()) return;
    setShowConfirm(false);
    setStatus("processing");
    setErrorMsg("");
    const blob = new Blob([text], { type: "text/plain" });
    const file = new File([blob], "input.txt", { type: "text/plain" });
    const prompt = `Mode: ${selectedMode}. Text: ${text}`;
    try {
      const data = await toolsApi.uploadFile(TOOL_ID, file, prompt);
      setStatus("done");
      setResultContent(data.result_content || "");
      setResult(data.output_file_url);
      setCreditsUsed(data.credits_used || CREDIT_COST);
      setShowToast(true);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
    }
  }

  function resetAll() {
    setText(""); setResult(null); setResultContent(""); setStatus("idle"); setErrorMsg("");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href={`/${locale}`} className="hover:text-blue-600">{tp.home || "Home"}</Link><span>/</span><span>{t.title || "Text Polish"}</span>
          <Link href={`/${locale}`} className="ml-auto text-xs text-blue-600 hover:text-blue-500">← {tp.startOver || "Back to Tools"}</Link>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">✨ {t.title || "Text Polish & Rewrite"}</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t.description || "Polish, rewrite, shorten, or expand your text with AI."} <span className="font-semibold text-blue-600">{t.cost || `${CREDIT_COST} credits`}</span>.</p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {/* Mode Selection */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">{tp.mode || "Mode"}</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {modeIds.map((id) => (
              <button key={id} onClick={() => setSelectedMode(id)}
                className={`rounded-lg border p-3 text-center transition-all ${selectedMode === id ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20" : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"}`}>
                <span className="block text-xl">{modes[id]?.icon || (id === "polish" ? "✨" : id === "rewrite" ? "🔄" : id === "shorten" ? "✂️" : "📝")}</span>
                <span className="mt-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300">{modes[id]?.label || id}</span>
                <span className="mt-0.5 block text-xs text-zinc-400">{modes[id]?.desc || ""}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text panels */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-500 dark:text-zinc-400">{t.originalText || "Original Text"}</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm leading-relaxed dark:border-zinc-700 dark:bg-zinc-800"
              placeholder={t.placeholder || "Paste or type your text here..."} />
            <p className="mt-1 text-xs text-zinc-400">{text.length} {t.characters || "characters"}</p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-500 dark:text-zinc-400">{t.resultLabel || "Result"}</label>
            <div className="flex min-h-[240px] w-full items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
              {status === "done" && (resultContent || result) ? (
                <div className="w-full overflow-auto">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-900 dark:text-zinc-100">{resultContent}</pre>
                </div>
              ) : status === "processing" ? (
                <div className="text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                  <p className="mt-2 text-sm text-zinc-500">{t.processing || "Processing..."}</p>
                </div>
              ) : status === "error" ? (
                <p className="text-sm text-red-500">{errorMsg}</p>
              ) : (
                <p className="text-sm text-zinc-400">{t.processedAppear || "Processed text will appear here"}</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {status === "idle" && (
          <div className="mt-6 flex gap-3">
            <button onClick={handleUploadClick} disabled={!text.trim()}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
              {`${(modes[selectedMode]?.label) || selectedMode} (${CREDIT_COST} credits)`}
            </button>
            <button onClick={() => setText("")}
              className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">
              {t.clear || "Clear"}
            </button>
          </div>
        )}

        {status === "done" && result && (
          <div className="mt-6 flex gap-3">
            <button onClick={() => navigator.clipboard.writeText(resultContent)}
              className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">
              {t.copy || "Copy"}
            </button>
            <a href={result} download target="_blank" rel="noopener noreferrer"
              className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
              {tp.downloadResult || "Download"}
            </a>
            <button onClick={resetAll}
              className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">
              {t.tryAnother || "Try Another Text"}
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="mt-6 flex gap-3">
            <button onClick={handleUploadClick}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              {tp.tryAgain || "Try Again"} ({CREDIT_COST} credits)
            </button>
            <button onClick={resetAll}
              className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">
              {t.clear || "Clear"}
            </button>
          </div>
        )}
      </div>

      <CreditConfirmDialog isOpen={!!user && showConfirm} creditsNeeded={CREDIT_COST} currentCredits={user?.credits || 0} toolName={t.title || TOOL_ID} locale={locale} dict={dict} onConfirm={handleUpload} onCancel={() => setShowConfirm(false)} />
      <LoginPromptDialog isOpen={showLoginPrompt} locale={locale} dict={dict} />
      {showToast && <CreditsUsedToast creditsUsed={creditsUsed} remaining={user?.credits ?? 0} onClose={() => setShowToast(false)} dict={dict} />}
    </div>
  );
}
