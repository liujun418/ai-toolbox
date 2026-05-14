"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useTool } from "@/hooks/useTool";
import { ToolSkeleton } from "@/components/LoadingSkeleton";
import { CreditConfirmDialog, CreditsUsedToast, LoginPromptDialog } from "@/components/CreditGuard";
import type { Locale } from "@/lib/i18n";

import { getCreditCost } from "@/lib/creditCosts";
const TOOL_ID = "style-transfer";
const STYLE_IDS = ["oil-painting", "watercolor", "sketch", "cartoon", "cyberpunk", "fantasy"] as const;
type StyleId = (typeof STYLE_IDS)[number];
const STYLE_ICONS: Record<string, string> = {
  "oil-painting": "🖼️", watercolor: "🎨", sketch: "✏️", cartoon: "🎬", cyberpunk: "🌆", fantasy: "✨",
};

export default function StyleTransferClient({ locale = "en" as Locale, dict }: { locale?: Locale; dict?: Record<string, unknown> }) {
  const CREDIT_COST = getCreditCost(TOOL_ID);
  const { user, loading } = useAuth();
  const [selectedStyle, setSelectedStyle] = useState<StyleId>("oil-painting");

  const tool = useTool({
    toolId: TOOL_ID,
    creditCost: CREDIT_COST,
    buildPrompt: ({ style }) => (style as string) || "oil-painting",
    locale,
    dict,
  });

  const t = (dict as any)?.styleTransfer || {};
  const tp = (dict as any)?.toolPage || {};
  const styles = (dict as any)?.styleTransfer?.styles || {};

  if (loading) return <ToolSkeleton />;

  const showLoginPrompt = !user && tool.showConfirm;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href={`/${locale}`} className="hover:text-blue-600">{tp.home || "Home"}</Link><span>/</span><span>{t.title || "Image Style Transfer"}</span>
          <Link href={`/${locale}`} className="ml-auto text-xs text-blue-600 hover:text-blue-500">← {tp.startOver || "Back to Tools"}</Link>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">🖼️ {t.title || "Image Style Transfer"}</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{t.description || "Transform photos into oil paintings, watercolors, anime art, and more."}</p>
        <div className="mt-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-50 to-yellow-100 px-3 py-1 text-sm font-semibold text-amber-800 shadow-sm ring-1 ring-amber-200/60 dark:from-amber-900/20 dark:to-yellow-900/20 dark:text-amber-300 dark:ring-amber-700/40">
            💎 {t.cost || `${CREDIT_COST} credits`}
          </span>
        </div>

        {/* Tips */}
        <div className="mt-4 rounded-xl border border-blue-200/80 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 text-sm shadow-sm dark:border-blue-800/60 dark:from-blue-950/30 dark:to-indigo-950/20">
          <p className="flex items-center gap-1.5 font-semibold text-blue-800 dark:text-blue-300">
            <span className="text-base">💡</span> {t.tipsTitle || "Pro Tips"}
          </p>
          <div className="mt-3 space-y-2">
            {(t.tips || [
              "Portrait or single-subject photos work best — complex scenes may lose detail during style transfer.",
              "Photos will be automatically center-cropped to a square format for optimal AI processing.",
              "Each style uses fixed parameters to ensure consistency — no need to adjust settings manually.",
              "For best results, use well-lit, clear photos with the subject centered in the frame."
            ]).map((tip: any, i: number) => {
              const icon = tip?.icon;
              const text = tip?.text || tip;
              const accentColors = [
                "bg-blue-100/70 dark:bg-blue-900/30 border-l-blue-400",
                "bg-purple-100/70 dark:bg-purple-900/30 border-l-purple-400",
                "bg-emerald-100/70 dark:bg-emerald-900/30 border-l-emerald-400",
                "bg-amber-100/70 dark:bg-amber-900/30 border-l-amber-400",
              ];
              return (
                <div key={i} className={`flex items-start gap-2.5 rounded-lg border-l-2 px-3 py-2 ${accentColors[i % 4]}`}>
                  {icon && <span className="mt-0.5 shrink-0 text-base leading-none">{icon}</span>}
                  <span className="text-blue-900 dark:text-blue-200">{text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {tool.fileError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{tool.fileError}</div>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {!tool.preview ? (
          <div onClick={() => tool.fileRef.current?.click()} className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 py-16 dark:border-zinc-700">
            <svg className="h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
            <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">{tp.uploadPhoto || "Upload a photo"}</p>
            <p className="mt-1 text-xs text-zinc-400">{tp.supportedFormats || "PNG, JPG, WebP — max 3MB"}</p>
            <input ref={tool.fileRef} type="file" accept="image/*" onChange={tool.handleFileChange} className="hidden" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div><p className="mb-2 text-sm font-medium text-zinc-500">{tp.original || "Original"}</p><img src={tool.preview} alt="Original" className="w-full rounded-xl object-contain border" /></div>
              <div>
                <p className="mb-2 text-sm font-medium text-zinc-500">{tp.result || "Result"}</p>
                <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
                  {tool.status === "done" && tool.resultUrl ? (
                    <img src={tool.resultUrl} alt="Result" className="w-full rounded-xl object-contain" />
                  ) : tool.status === "uploading" ? (
                    <div className="text-center"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" /><p className="mt-2 text-sm text-zinc-500">{t.processing || "Transferring style..."}</p></div>
                  ) : tool.status === "error" ? (
                    <p className="text-sm text-red-500">{tool.errorMsg}</p>
                  ) : (
                    <p className="text-sm text-zinc-400">{t.uploadToSee || "Select a style and transform to see result"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Style selector — 3 columns */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">{tp.style || "Style"}</label>
              <div className="grid grid-cols-3 gap-2">
                {STYLE_IDS.map((id) => {
                  const info = styles[id] || {};
                  return (
                    <button key={id} onClick={() => setSelectedStyle(id)}
                      className={`rounded-lg border p-3 text-left transition-all ${
                        selectedStyle === id
                          ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20"
                          : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                      }`}>
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg leading-none">{STYLE_ICONS[id]}</span>
                        <span className={`text-sm font-semibold leading-tight ${selectedStyle === id ? "text-blue-700 dark:text-blue-300" : "text-zinc-700 dark:text-zinc-300"}`}>
                          {info.label || id}
                        </span>
                      </div>
                      {info.desc && (
                        <div className="mt-1 text-xs leading-tight text-zinc-500 dark:text-zinc-400">{info.desc}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {tool.status === "idle" && (
              <div className="flex gap-3">
                <button onClick={() => tool.handleUpload({ style: selectedStyle })}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{t.button || `Transform (${CREDIT_COST} credits)`}</button>
                <button onClick={tool.reset}
                  className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{tp.cancel || "Cancel"}</button>
              </div>
            )}

            {tool.status === "done" && tool.resultUrl && (
              <div className="flex gap-3">
                <a href={tool.resultUrl} download target="_blank" rel="noopener noreferrer"
                  className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">{tp.downloadResult || "Download Result"}</a>
                <button onClick={tool.reset}
                  className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{t.tryAnother || "Try Another Photo"}</button>
              </div>
            )}

            {tool.status === "error" && (
              <div className="flex gap-3">
                <button onClick={() => tool.handleUpload({ style: selectedStyle })}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{tp.tryAgain || "Try Again"}</button>
                <button onClick={tool.reset}
                  className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{tp.cancel || "Cancel"}</button>
              </div>
            )}
          </div>
        )}
      </div>

      <CreditConfirmDialog isOpen={!!user && tool.showConfirm} creditsNeeded={CREDIT_COST} currentCredits={user?.credits || 0} toolName={t.title || TOOL_ID} locale={locale} dict={dict} onConfirm={() => tool.handleUpload({ style: selectedStyle })} onCancel={() => tool.setShowConfirm(false)} />
      <LoginPromptDialog isOpen={showLoginPrompt} locale={locale} dict={dict} />
      {tool.showToast && <CreditsUsedToast creditsUsed={tool.creditsUsed} remaining={user?.credits ?? 0} onClose={() => tool.setShowToast(false)} dict={dict} />}
    </div>
  );
}
