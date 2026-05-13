"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { toolsApi } from "@/lib/api";
import { useUsageTracker } from "@/hooks/useUsageTracker";
import { CreditConfirmDialog, CreditsUsedToast, LoginPromptDialog } from "@/components/CreditGuard";
import type { Locale } from "@/lib/i18n";

import { getCreditCost } from "@/lib/creditCosts";
const TOOL_ID = "pdf-to-word";

export default function PdfToWordClient({ locale = "en" as Locale, dict }: { locale?: Locale; dict?: Record<string, unknown> }) {
  const CREDIT_COST = getCreditCost(TOOL_ID);
  const { user, loading } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const t = (dict as any)?.pdfToWord || {};
  const tp = (dict as any)?.toolPage || {};
  const nav = (dict as any)?.nav || {};

  useUsageTracker({ toolId: TOOL_ID, toolName: t.title || "PDF to Word", icon: "📄", creditsUsed, trigger: creditsUsed > 0 });

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-16 text-center text-zinc-400">{tp.loading || "Loading..."}</div>;

  const showLoginPrompt = !user && showConfirm;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== "application/pdf") { setErrorMsg("Please upload a PDF file."); return; }
    setFile(f);
    setStatus("idle");
    setResultUrl(null);
    setErrorMsg("");
  }

  function handleConvert() {
    if (!file) return;
    setShowConfirm(true);
  }

  async function doConvert() {
    if (!file) return;
    setShowConfirm(false);
    setStatus("uploading");
    setErrorMsg("");
    try {
      const data = await toolsApi.uploadFile(TOOL_ID, file);
      setStatus("done");
      setResultUrl(data.output_file_url);
      setCreditsUsed(data.credits_used || CREDIT_COST);
      setShowToast(true);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
    }
  }

  function reset() { setFile(null); setResultUrl(null); setStatus("idle"); setErrorMsg(""); }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href={`/${locale}`} className="hover:text-blue-600">{tp.home || "Home"}</Link><span>/</span><span>{t.title || "PDF to Word"}</span>
          <Link href={`/${locale}`} className="ml-auto text-xs text-blue-600 hover:text-blue-500">← {tp.startOver || "Back to Tools"}</Link>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">📄 {t.title || "PDF to Word"}</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t.description || "Convert PDF documents to editable Word (.docx) files."} {nav.credits ? `Costs ${nav.credits}:` : "Costs"} <span className="font-semibold text-blue-600">{t.cost1 || t.cost2 || "1-2 credits"}</span>.</p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {!resultUrl ? (
          <div className="space-y-6">
            {!file ? (
              <div onClick={() => fileRef.current?.click()} className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 py-16 dark:border-zinc-700">
                <svg className="h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">{tp.uploadPdf || "Upload a PDF file"}</p>
                <p className="mt-1 text-xs text-zinc-400">{tp.supportedFormatsPdf || "PDF — max 20MB"}</p>
                <input ref={fileRef} type="file" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden" />
              </div>
            ) : (
              <>
                <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{file.name}</p>
                      <p className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                </div>

                {status === "idle" && (
                  <div className="flex gap-3">
                    <button onClick={handleConvert}
                      className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                      {t.button || "Convert to Word"} ({CREDIT_COST} {t.cost1 || "credits"})
                    </button>
                    <button onClick={() => { setFile(null); setErrorMsg(""); }}
                      className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">
                      {tp.cancel || "Cancel"}
                    </button>
                  </div>
                )}

                {status === "uploading" && (
                  <div className="py-8 text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    <p className="mt-3 text-sm text-zinc-500">{t.processing || "Converting..."}</p>
                  </div>
                )}

                {status === "error" && (
                  <div className="flex gap-3">
                    <button onClick={handleConvert}
                      className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                      {tp.tryAgain || "Try Again"}
                    </button>
                    <button onClick={reset}
                      className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">
                      {tp.cancel || "Cancel"}
                    </button>
                  </div>
                )}
              </>
            )}

            {errorMsg && status === "idle" && <p className="text-sm text-red-600">{errorMsg}</p>}
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="mb-4 text-5xl">✅</div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">{tp.downloadResult || "Conversion Complete!"}</h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t.download || "Your document is ready for download."}</p>
            <div className="mt-6 flex justify-center gap-3">
              <a href={resultUrl} download target="_blank" rel="noopener noreferrer"
                className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
                {t.download || "Download .docx"}
              </a>
              <button onClick={reset}
                className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">
                {tp.tryAnother || "Convert Another File"}
              </button>
            </div>
          </div>
        )}
      </div>

      <CreditConfirmDialog isOpen={!!user && showConfirm} creditsNeeded={CREDIT_COST} currentCredits={user?.credits || 0} toolName={t.title || TOOL_ID} locale={locale} dict={dict} onConfirm={doConvert} onCancel={() => setShowConfirm(false)} />
      <LoginPromptDialog isOpen={showLoginPrompt} locale={locale} dict={dict} />
      {showToast && <CreditsUsedToast creditsUsed={creditsUsed} remaining={user?.credits ?? 0} onClose={() => setShowToast(false)} dict={dict} />}
    </div>
  );
}
