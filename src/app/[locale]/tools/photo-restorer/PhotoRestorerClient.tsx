"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useTool } from "@/hooks/useTool";
import { ToolSkeleton } from "@/components/LoadingSkeleton";
import { CreditConfirmDialog, CreditsUsedToast, LoginPromptDialog } from "@/components/CreditGuard";
import type { Locale } from "@/lib/i18n";

import { getCreditCost } from "@/lib/creditCosts";
const TOOL_ID = "photo-restorer";
const STRENGTHS = ["light", "medium", "heavy"] as const;
type Strength = (typeof STRENGTHS)[number];

export default function PhotoRestorerClient({ locale = "en" as Locale, dict }: { locale?: Locale; dict?: Record<string, unknown> }) {
  const CREDIT_COST = getCreditCost(TOOL_ID);
  const { user, loading } = useAuth();
  const [strength, setStrength] = useState<Strength>("medium");

  const tool = useTool({
    toolId: TOOL_ID,
    creditCost: CREDIT_COST,
    buildPrompt: ({ strength: s }) => (s as string) || "medium",
    locale,
    dict,
  });

  const t = (dict as any)?.photoRestorer || {};
  const tp = (dict as any)?.toolPage || {};
  const strengths = t.strengths || {};

  if (loading) return <ToolSkeleton />;

  const showLoginPrompt = !user && tool.showConfirm;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href={`/${locale}`} className="hover:text-blue-600">{tp.home || "Home"}</Link><span>/</span><span>{t.title || "Photo Restorer"}</span>
          <Link href={`/${locale}`} className="ml-auto text-xs text-blue-600 hover:text-blue-500">← {tp.startOver || "Back to Tools"}</Link>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">{t.title || "Photo Restorer"}</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t.description || "Restore old, blurry, or damaged photos with AI face enhancement."} <span className="font-semibold text-blue-600">{t.cost || `${CREDIT_COST} credits`}</span>.</p>
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
                className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">{t.download || "Download Restored Photo"}</a>
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
                    <div className="text-center"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" /><p className="mt-2 text-sm text-zinc-500">{t.processing || "Restoring photo..."}</p></div>
                  ) : tool.status === "error" ? (
                    <p className="text-sm text-red-500">{tool.errorMsg}</p>
                  ) : (
                    <p className="text-sm text-zinc-400">{t.uploadToSee || "Select strength and restore to see result"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Restoration strength selector */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">{t.strength || "Restoration Strength"}</label>
              <div className="grid gap-2 sm:grid-cols-3">
                {STRENGTHS.map((s) => {
                  const info = strengths[s] || {};
                  return (
                    <button key={s} onClick={() => setStrength(s)}
                      className={`rounded-lg border px-4 py-3 text-left transition-all ${
                        strength === s
                          ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20"
                          : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                      }`}>
                      <div className={`text-sm font-semibold ${strength === s ? "text-blue-700 dark:text-blue-300" : "text-zinc-700 dark:text-zinc-300"}`}>
                        {info.label || s}
                      </div>
                      <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{info.desc || ""}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {tool.status === "idle" && (
              <div className="flex gap-3">
                <button onClick={() => tool.handleUpload({ strength })}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{t.button || `Restore Photo (${CREDIT_COST} credits)`}</button>
                <button onClick={tool.reset}
                  className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{tp.cancel || "Cancel"}</button>
              </div>
            )}

            {tool.status === "error" && (
              <div className="flex gap-3">
                <button onClick={() => tool.handleUpload({ strength })}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{tp.tryAgain || "Try Again"}</button>
                <button onClick={tool.reset}
                  className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{tp.cancel || "Cancel"}</button>
              </div>
            )}
          </div>
        )}
      </div>

      <CreditConfirmDialog isOpen={!!user && tool.showConfirm} creditsNeeded={CREDIT_COST} currentCredits={user?.credits || 0} toolName={t.title || TOOL_ID} locale={locale} dict={dict} onConfirm={() => tool.handleUpload({ strength })} onCancel={() => tool.setShowConfirm(false)} />
      <LoginPromptDialog isOpen={showLoginPrompt} locale={locale} dict={dict} />
      {tool.showToast && <CreditsUsedToast creditsUsed={tool.creditsUsed} remaining={user?.credits ?? 0} onClose={() => tool.setShowToast(false)} dict={dict} />}
    </div>
  );
}
