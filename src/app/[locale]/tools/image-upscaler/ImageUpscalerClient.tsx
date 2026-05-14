"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useTool } from "@/hooks/useTool";
import { ToolSkeleton } from "@/components/LoadingSkeleton";
import { CreditConfirmDialog, CreditsUsedToast, LoginPromptDialog } from "@/components/CreditGuard";
import type { Locale } from "@/lib/i18n";

import { getCreditCost } from "@/lib/creditCosts";
const TOOL_ID = "image-upscaler";
const SCALES = ["2", "4"] as const;
const IMAGE_TYPES = ["photo", "anime"] as const;
type ImageType = (typeof IMAGE_TYPES)[number];

export default function ImageUpscalerClient({ locale = "en" as Locale, dict }: { locale?: Locale; dict?: Record<string, unknown> }) {
  const CREDIT_COST = getCreditCost(TOOL_ID);
  const { user, loading } = useAuth();
  const [selectedScale, setSelectedScale] = useState("2");
  const [imageType, setImageType] = useState<ImageType>("photo");

  const tool = useTool({
    toolId: TOOL_ID,
    creditCost: CREDIT_COST,
    buildPrompt: ({ scale, imageType: type }) => `${(type as string) || "photo"}:${(scale as string) || "2"}`,
    locale,
    dict,
  });

  const t = (dict as any)?.imageUpscaler || {};
  const tp = (dict as any)?.toolPage || {};
  const scales = t.scales || {};
  const types = t.types || {};

  if (loading) return <ToolSkeleton />;

  const showLoginPrompt = !user && tool.showConfirm;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href={`/${locale}`} className="hover:text-blue-600">{tp.home || "Home"}</Link><span>/</span><span>{t.title || "Image Upscaler"}</span>
          <Link href={`/${locale}`} className="ml-auto text-xs text-blue-600 hover:text-blue-500">← {tp.startOver || "Back to Tools"}</Link>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">{t.title || "Image Upscaler"}</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t.description || "Enhance image resolution with AI super-resolution."} <span className="font-semibold text-blue-600">{t.cost || `${CREDIT_COST} credits`}</span>.</p>
      </div>

      {tool.fileError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{tool.fileError}</div>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {!tool.preview ? (
          <div onClick={() => tool.fileRef.current?.click()} className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 py-16 dark:border-zinc-700">
            <svg className="h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
            <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">{tp.uploadImage || "Upload an image"}</p>
            <p className="mt-1 text-xs text-zinc-400">{tp.supportedFormats || "PNG, JPG, WebP — max 10MB"}</p>
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
                    <div className="text-center"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" /><p className="mt-2 text-sm text-zinc-500">{t.processing || "Upscaling image..."}</p></div>
                  ) : tool.status === "error" ? (
                    <p className="text-sm text-red-500">{tool.errorMsg}</p>
                  ) : (
                    <p className="text-sm text-zinc-400">{t.uploadToSee || "Select options and upscale to see result"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Image type selector */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">{t.imageType || "Image Type"}</label>
              <div className="grid grid-cols-2 gap-2">
                {IMAGE_TYPES.map((id) => {
                  const info = types[id] || {};
                  return (
                    <button key={id} onClick={() => setImageType(id)}
                      className={`rounded-lg border px-4 py-3 text-left transition-all ${
                        imageType === id
                          ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20"
                          : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                      }`}>
                      <div className={`text-sm font-semibold ${imageType === id ? "text-blue-700 dark:text-blue-300" : "text-zinc-700 dark:text-zinc-300"}`}>
                        {info.label || id}
                      </div>
                      <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{info.desc || ""}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scale selector */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">{tp.upscaleFactor || "Upscale Factor"}</label>
              <div className="grid grid-cols-2 gap-2">
                {SCALES.map((s) => (
                  <button key={s} onClick={() => setSelectedScale(s)}
                    className={`rounded-lg border px-4 py-3 text-center transition-all ${selectedScale === s ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20" : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"}`}>
                    <span className={`text-lg font-bold ${selectedScale === s ? "text-blue-700 dark:text-blue-300" : "text-zinc-700 dark:text-zinc-300"}`}>{scales[s] || `${s}x`}</span>
                  </button>
                ))}
              </div>
            </div>

            {tool.status === "idle" && (
              <div className="flex gap-3">
                <button onClick={() => tool.handleUpload({ scale: selectedScale, imageType })}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{t.button || `Upscale Image (${CREDIT_COST} credits)`}</button>
                <button onClick={tool.reset}
                  className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{tp.cancel || "Cancel"}</button>
              </div>
            )}

            {tool.status === "done" && tool.resultUrl && (
              <div className="flex gap-3">
                <a href={tool.resultUrl} download target="_blank" rel="noopener noreferrer"
                  className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">{tp.downloadResult || "Download Result"}</a>
                <button onClick={tool.reset}
                  className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{t.tryAnother || "Try Another Image"}</button>
              </div>
            )}

            {tool.status === "error" && (
              <div className="flex gap-3">
                <button onClick={() => tool.handleUpload({ scale: selectedScale, imageType })}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{tp.tryAgain || "Try Again"}</button>
                <button onClick={tool.reset}
                  className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{tp.cancel || "Cancel"}</button>
              </div>
            )}
          </div>
        )}
      </div>

      <CreditConfirmDialog isOpen={!!user && tool.showConfirm} creditsNeeded={CREDIT_COST} currentCredits={user?.credits || 0} toolName={t.title || TOOL_ID} locale={locale} dict={dict} onConfirm={() => tool.handleUpload({ scale: selectedScale, imageType })} onCancel={() => tool.setShowConfirm(false)} />
      <LoginPromptDialog isOpen={showLoginPrompt} locale={locale} dict={dict} />
      {tool.showToast && <CreditsUsedToast creditsUsed={tool.creditsUsed} remaining={user?.credits ?? 0} onClose={() => tool.setShowToast(false)} dict={dict} />}
    </div>
  );
}
