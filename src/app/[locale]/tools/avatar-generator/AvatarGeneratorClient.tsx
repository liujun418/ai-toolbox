"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useTool } from "@/hooks/useTool";
import { ToolSkeleton } from "@/components/LoadingSkeleton";
import { CreditConfirmDialog, CreditsUsedToast, LoginPromptDialog } from "@/components/CreditGuard";
import type { Locale } from "@/lib/i18n";

const TOOL_ID = "avatar-generator";
const CREDIT_COST = 5;

const STYLES = [
  { id: "cartoon", label: "Cartoon", desc: "3D Pixar-style" },
  { id: "anime", label: "Anime", desc: "Japanese anime portrait" },
  { id: "professional", label: "Professional", desc: "Photorealistic headshot" },
  { id: "pixel-art", label: "Pixel Art", desc: "Retro 16-bit sprite" },
  { id: "watercolor", label: "Watercolor", desc: "Soft artistic washes" },
  { id: "oil-painting", label: "Oil Painting", desc: "Classical masterpiece" },
] as const;

export default function AvatarGeneratorClient({ locale = "en" as Locale, dict }: { locale?: Locale; dict?: Record<string, unknown> }) {
  const { user, loading } = useAuth();
  const [selectedStyle, setSelectedStyle] = useState("cartoon");

  const tool = useTool({
    toolId: TOOL_ID,
    creditCost: CREDIT_COST,
    getStyle: ({ style }) => typeof style === "string" ? style : "cartoon",
    locale,
    dict,
  });

  const t = (dict as any)?.avatarGenerator || {};
  const tp = (dict as any)?.toolPage || {};
  const styles = (dict as any)?.avatarGenerator?.styles || {};
  const nav = (dict as any)?.nav || {};

  if (loading) return <ToolSkeleton />;

  const showLoginPrompt = !user && tool.showConfirm;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href={`/${locale}`} className="hover:text-blue-600">{tp.home || "Home"}</Link><span>/</span><span>{t.title || "AI Avatar Generator"}</span>
          <Link href={`/${locale}`} className="ml-auto text-xs text-blue-600 hover:text-blue-500">← {tp.startOver || "Back to Tools"}</Link>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">🎭 {t.title || "AI Avatar Generator"}</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{t.description || "Transform your photo into cartoon, anime, or professional avatars."}</p>
        <div className="mt-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-50 to-yellow-100 px-3 py-1 text-sm font-semibold text-amber-800 shadow-sm ring-1 ring-amber-200/60 dark:from-amber-900/20 dark:to-yellow-900/20 dark:text-amber-300 dark:ring-amber-700/40">
            💎 {t.cost || `${CREDIT_COST} credits`}
          </span>
        </div>
      </div>

      {tool.fileError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{tool.fileError}</div>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {/* Upload state */}
        {!tool.preview ? (
          <div onClick={() => tool.fileRef.current?.click()} className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 py-16 transition-colors hover:border-blue-400 hover:bg-blue-50/30 dark:border-zinc-700 dark:hover:border-blue-500 dark:hover:bg-blue-900/10">
            <svg className="h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
            <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">{tp.uploadPhoto || "Upload a photo"}</p>
            <p className="mt-1 text-xs text-zinc-400">{tp.supportedFormats || "PNG, JPG, WebP — max 10MB"}</p>
            <input ref={tool.fileRef} type="file" accept="image/*" onChange={tool.handleFileChange} className="hidden" />
          </div>
        ) : /* Result state */
        tool.status === "done" && tool.resultUrl ? (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium text-zinc-500">{tp.original || "Original"}</p>
                <div className="aspect-square overflow-hidden rounded-xl border bg-zinc-50 dark:bg-zinc-800">
                  <img src={tool.preview} alt="Original" className="h-full w-full object-cover" />
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-zinc-500">{tp.result || "Result"}</p>
                <div className="aspect-square overflow-hidden rounded-xl border bg-zinc-50 dark:bg-zinc-800">
                  <img src={tool.resultUrl} alt="Generated avatar" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-zinc-400">{t.selectBest || "Choose your favorite"}</p>
            <div className="flex justify-center gap-3">
              <a href={tool.resultUrl} download target="_blank" rel="noopener noreferrer"
                className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors">{t.download || "Download Avatar"}</a>
              <button onClick={tool.reset}
                className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors">{t.tryAnother || "Try Another Photo"}</button>
            </div>
          </div>
        ) : (
          /* Processing / idle / error state */
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium text-zinc-500">{tp.original || "Original"}</p>
                <div className="aspect-square overflow-hidden rounded-xl border bg-zinc-50 dark:bg-zinc-800">
                  <img src={tool.preview} alt="Original" className="h-full w-full object-cover" />
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-zinc-500">{tp.result || "Result"}</p>
                <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
                  {tool.status === "uploading" ? (
                    <div className="text-center">
                      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                      <p className="mt-2 text-sm text-zinc-500">{t.generating || "Generating..."}</p>
                    </div>
                  ) : tool.status === "error" ? (
                    <p className="text-sm text-red-500 px-4 text-center">{tool.errorMsg}</p>
                  ) : (
                    <p className="text-sm text-zinc-400 px-4 text-center">{t.resultReady || "Select a style and generate to see the result"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Style selector */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">{tp.style || "Style"}</label>
              <div className="grid grid-cols-3 gap-2.5">
                {STYLES.map((s) => (
                  <button key={s.id} onClick={() => setSelectedStyle(s.id)}
                    className={`rounded-xl border p-3.5 text-left transition-all ${
                      selectedStyle === s.id
                        ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600 dark:border-blue-500 dark:bg-blue-900/20 dark:ring-blue-500"
                        : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                    }`}>
                    <span className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200">{styles[s.id] || s.label}</span>
                    <span className="mt-0.5 block text-xs text-zinc-400">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            {tool.status === "idle" && (
              <div className="flex gap-3">
                <button onClick={() => tool.handleUpload({ style: selectedStyle })}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">{t.button || `Generate Avatar (${CREDIT_COST} credits)`}</button>
                <button onClick={tool.reset}
                  className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors">{tp.cancel || "Cancel"}</button>
              </div>
            )}

            {tool.status === "error" && (
              <div className="flex gap-3">
                <button onClick={() => tool.handleUpload({ style: selectedStyle })}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">{tp.tryAgain || "Try Again"}</button>
                <button onClick={tool.reset}
                  className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors">{tp.cancel || "Cancel"}</button>
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
