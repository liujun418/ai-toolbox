"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useAuth } from "@/lib/auth-context";
import { useTool } from "@/hooks/useTool";
import { ToolSkeleton } from "@/components/LoadingSkeleton";
import { CreditConfirmDialog, CreditsUsedToast, LoginPromptDialog } from "@/components/CreditGuard";
import { getCreditCost } from "@/lib/creditCosts";
import type { Locale } from "@/lib/i18n";

const TOOL_ID = "image-description";

export default function ImageDescriptionClient({ locale = "en" as Locale, dict }: { locale?: Locale; dict?: Record<string, unknown> }) {
  const { user, loading } = useAuth();
  const t = ((dict as any)?.tools?.[TOOL_ID] as Record<string, string>) || {};
  const tp = (dict as any)?.toolPage || {};

  const [customPrompt, setCustomPrompt] = useState("");

  const buildPrompt = () => customPrompt.trim() || undefined;

  const tool = useTool({
    toolId: TOOL_ID,
    creditCost: getCreditCost(TOOL_ID),
    buildPrompt,
    locale,
    dict,
  });

  const handleProcess = useCallback(() => {
    tool.handleUpload({});
  }, [tool.handleUpload]);

  const description = tool.resultContent;
  const altMatch = description?.match(/^ALT:\s*(.+)$/m);
  const descMatch = description?.match(/^DESC:\s*(.+)$/m);
  const altText = altMatch?.[1]?.trim();
  const descText = descMatch?.[1]?.trim() || description;

  if (loading) return <ToolSkeleton />;

  const showLoginPrompt = !user && tool.showConfirm;

  return (
    <ToolLayout toolId={TOOL_ID} locale={locale as string} dict={dict}>

      {tool.fileError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{tool.fileError}</div>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {!tool.preview ? (
          <div onClick={() => tool.fileRef.current?.click()} className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 py-16 dark:border-zinc-700">
            <svg className="h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
            <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">{tp.uploadPhoto || "Upload an image to describe"}</p>
            <p className="mt-1 text-xs text-zinc-400">{tp.supportedFormats || "PNG, JPG, WebP — max 10MB"}</p>
            <input ref={tool.fileRef} type="file" accept="image/*" onChange={tool.handleFileChange} className="hidden" />
          </div>
        ) : tool.status === "done" && description !== null ? (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div><p className="mb-2 text-sm font-medium text-zinc-500">Image</p><img src={tool.preview} alt="Original" className="w-full rounded-xl border object-contain" /></div>
              <div>
                {altText && (
                  <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/20">
                    <p className="mb-1 text-xs font-semibold uppercase text-green-600 dark:text-green-400">ALT Text (SEO)</p>
                    <p className="text-sm text-green-800 dark:text-green-200">{altText}</p>
                    <button onClick={() => navigator.clipboard.writeText(altText)}
                      className="mt-2 rounded border border-green-300 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900">Copy ALT</button>
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
              <p className="mb-1 text-xs font-semibold uppercase text-zinc-400">Description</p>
              <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{descText}</p>
              <button onClick={() => navigator.clipboard.writeText(descText || "")}
                className="mt-2 rounded border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800">Copy Description</button>
            </div>
            <div className="flex gap-3">
              <button onClick={tool.reset}
                className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{tp.tryAnother || "Describe Another"}</button>
            </div>
          </div>
        ) : tool.status === "uploading" ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.generating || "Analyzing image..."}</p>
            <p className="mt-1 text-xs text-zinc-400">Analysis takes ~30-60 seconds</p>
          </div>
        ) : tool.status === "error" ? (
          <div className="py-8 text-center">
            <p className="mb-4 text-sm text-red-500">{tool.errorMsg}</p>
            <div className="flex justify-center gap-3">
              <button onClick={handleProcess} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{tp.tryAgain || "Try Again"}</button>
              <button onClick={tool.reset} className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{tp.cancel || "Cancel"}</button>
            </div>
          </div>
        ) : (
          <>
            <img src={tool.preview} alt="Preview" className="max-h-[400px] w-full rounded-xl border object-contain" />
            <div className="mt-4">
              <input type="text" value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={t.promptPlaceholder || "Ask a question about the image (optional)"}
                className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-base text-zinc-800 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder:text-zinc-500" />
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={handleProcess}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700">
                {t.button || `Describe Image (${getCreditCost(TOOL_ID)} credits)`}
              </button>
              <button onClick={tool.reset}
                className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{tp.cancel || "Cancel"}</button>
            </div>
          </>
        )}
      </div>

      <CreditConfirmDialog isOpen={!!user && tool.showConfirm} creditsNeeded={getCreditCost(TOOL_ID)} currentCredits={user?.credits || 0} toolName={t.name || TOOL_ID} locale={locale} dict={dict} onConfirm={handleProcess} onCancel={() => tool.setShowConfirm(false)} />
      <LoginPromptDialog isOpen={showLoginPrompt} locale={locale} dict={dict} />
      {tool.showToast && <CreditsUsedToast creditsUsed={tool.creditsUsed} remaining={user?.credits ?? 0} onClose={() => tool.setShowToast(false)} dict={dict} />}
    </ToolLayout>
  );
}
