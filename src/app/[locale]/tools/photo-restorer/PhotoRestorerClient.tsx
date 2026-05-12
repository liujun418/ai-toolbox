"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useTool } from "@/hooks/useTool";
import { ToolSkeleton } from "@/components/LoadingSkeleton";
import { CreditConfirmDialog, CreditsUsedToast } from "@/components/CreditGuard";
import type { Locale } from "@/lib/i18n";

import { getCreditCost } from "@/lib/creditCosts";
const TOOL_ID = "photo-restorer";

export default function PhotoRestorerClient({ locale = "en" as Locale, dict }: { locale?: Locale; dict?: Record<string, unknown> }) {
  const CREDIT_COST = getCreditCost(TOOL_ID);
  const { user, loading } = useAuth();
  const [colorize, setColorize] = useState(false);

  const tool = useTool({
    toolId: TOOL_ID,
    creditCost: CREDIT_COST,
    buildPrompt: ({ colorize }) => colorize
      ? "Restore this damaged photo and colorize it with natural colors."
      : "Restore this damaged photo, fix scratches, blur, and noise.",
    locale,
    dict,
  });

  const t = (dict as any)?.photoRestorer || {};
  const tp = (dict as any)?.toolPage || {};
  const nav = (dict as any)?.nav || {};

  if (loading) return <ToolSkeleton />;
  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href={`/${locale}`} className="hover:text-blue-600">{tp.home || "Home"}</Link><span>/</span><span>{t.title || "Photo Restorer"}</span>
          <Link href={`/${locale}`} className="ml-auto text-xs text-blue-600 hover:text-blue-500">← {tp.startOver || "Back to Tools"}</Link>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">📷 {t.title || "Photo Restorer"}</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t.description || "Restore and enhance old, blurry, or damaged photos."} {nav.credits ? `Costs ${nav.credits}:` : "Costs"} <span className="font-semibold text-blue-600">{CREDIT_COST} {t.cost || "credits"}</span>.</p>
      </div>

      {tool.fileError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{tool.fileError}</div>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {!tool.preview ? (
          <div onClick={() => tool.fileRef.current?.click()} className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 py-16 dark:border-zinc-700">
            <svg className="h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
            <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">{tp.uploadPhoto || "Upload an old or damaged photo"}</p>
            <p className="mt-1 text-xs text-zinc-400">{tp.supportedFormats || "PNG, JPG, WebP — max 10MB"}</p>
            <input ref={tool.fileRef} type="file" accept="image/*" onChange={tool.handleFileChange} className="hidden" />
          </div>
        ) : tool.status === "done" && tool.resultUrl ? (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div><p className="mb-2 text-sm font-medium text-zinc-500">{tp.original || "Original"}</p><img src={tool.preview} alt="Original" className="w-full rounded-xl object-contain border" /></div>
              <div><p className="mb-2 text-sm font-medium text-zinc-500">{tp.result || "Result"}</p><img src={tool.resultUrl} alt="Result" className="w-full rounded-xl object-contain border" /></div>
            </div>
            <div className="flex gap-3">
              <a href={tool.resultUrl} download target="_blank" rel="noopener noreferrer"
                className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">{t.download || "Download Result"}</a>
              <button onClick={tool.reset}
                className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{t.tryAnother || "Try Another Photo"}</button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div><p className="mb-2 text-sm font-medium text-zinc-500">{tp.original || "Original"}</p><img src={tool.preview} alt="Original" className="w-full rounded-xl object-contain" /></div>
              <div>
                <p className="mb-2 text-sm font-medium text-zinc-500">{tp.result || "Result"}</p>
                <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
                  {tool.status === "uploading" ? (
                    <div className="text-center"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" /><p className="mt-2 text-sm text-zinc-500">{t.processing || "Restoring..."}</p></div>
                  ) : tool.status === "error" ? (
                    <p className="text-sm text-red-500">{tool.errorMsg}</p>
                  ) : (
                    <p className="text-sm text-zinc-400">{t.uploadToSee || "Configure options and restore to see result"}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="colorize" checked={colorize} onChange={(e) => setColorize(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-600" />
              <label htmlFor="colorize" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t.colorize || "Colorize (convert black & white to color)"}
              </label>
            </div>

            {tool.status === "idle" && (
              <div className="flex gap-3">
                <button onClick={() => tool.handleUpload({ colorize })}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{t.button || "Restore Photo"} ({CREDIT_COST} {t.cost || "credits"})</button>
                <button onClick={tool.reset}
                  className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{tp.cancel || "Cancel"}</button>
              </div>
            )}

            {tool.status === "error" && (
              <div className="flex gap-3">
                <button onClick={() => tool.handleUpload({ colorize })}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{tp.tryAgain || "Try Again"}</button>
                <button onClick={tool.reset}
                  className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{tp.cancel || "Cancel"}</button>
              </div>
            )}
          </div>
        )}
      </div>

      <CreditConfirmDialog isOpen={tool.showConfirm} creditsNeeded={CREDIT_COST} currentCredits={user?.credits || 0} toolName={t.title || TOOL_ID} locale={locale} dict={dict} onConfirm={() => tool.handleUpload({ colorize })} onCancel={() => tool.setShowConfirm(false)} />
      {tool.showToast && <CreditsUsedToast creditsUsed={tool.creditsUsed} remaining={user?.credits || 0} onClose={() => tool.setShowToast(false)} dict={dict} />}
    </div>
  );
}
