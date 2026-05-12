"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { toolsApi } from "@/lib/api";
import { useUsageTracker } from "@/hooks/useUsageTracker";
import { getLocaleFromPathname } from "@/lib/locale";
import { CreditConfirmDialog, CreditsUsedToast } from "@/components/CreditGuard";
import type { Locale } from "@/lib/i18n";

import { getCreditCost } from "@/lib/creditCosts";
const TOOL_ID = "image-upscaler";

export default function ImageUpscalerClient({ locale = "en" as Locale, dict }: { locale?: Locale; dict?: Record<string, unknown> }) {
  const CREDIT_COST = getCreditCost(TOOL_ID);
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedScale, setSelectedScale] = useState("2x");
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const t = (dict as any)?.imageUpscaler || {};
  const tp = (dict as any)?.toolPage || {};
  const scales = (dict as any)?.imageUpscaler?.scales || {};
  const nav = (dict as any)?.nav || {};

  useUsageTracker({ toolId: TOOL_ID, toolName: t.title || "Image Upscaler", icon: "🔍", creditsUsed, trigger: creditsUsed > 0 });

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-16 text-center text-zinc-400">{tp.loading || "Loading..."}</div>;
  if (!user) { router.push(`/${locale}/login`); return null; }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    setStatus("idle");
    setResultUrl(null);
    setErrorMsg("");
  }

  function handleUploadClick() { if (!file) return; setShowConfirm(true); }

  async function handleUpload() {
    if (!file) return;
    setShowConfirm(false);
    setStatus("uploading");
    setErrorMsg("");
    const prompt = `Upscale image by ${selectedScale}. Enhance details and quality.`;
    try {
      const data = await toolsApi.uploadFile(TOOL_ID, file, prompt);
      if (!data.output_file_url) { setStatus("error"); setErrorMsg("Processing failed. Please try again."); return; }
      setStatus("done");
      setResultUrl(data.output_file_url);
      setCreditsUsed(data.credits_used || CREDIT_COST);
      setShowToast(true);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
    }
  }

  function reset() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null); setFile(null); setResultUrl(null); setStatus("idle"); setErrorMsg("");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href={`/${locale}`} className="hover:text-blue-600">{tp.home || "Home"}</Link><span>/</span><span>{t.title || "Image Upscaler"}</span>
          <Link href={`/${locale}`} className="ml-auto text-xs text-blue-600 hover:text-blue-500">← {tp.startOver || "Back to Tools"}</Link>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">🔍 {t.title || "Image Upscaler"}</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t.description || "Enhance image resolution with AI super-resolution."} {nav.credits ? `Costs ${nav.credits}:` : "Costs"} <span className="font-semibold text-blue-600">{CREDIT_COST} {t.cost || "credits"}</span>.</p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {!preview ? (
          <div onClick={() => fileRef.current?.click()} className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 py-16 dark:border-zinc-700">
            <svg className="h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
            <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">{tp.uploadImage || "Upload an image"}</p>
            <p className="mt-1 text-xs text-zinc-400">{tp.supportedFormats || "PNG, JPG, WebP — max 5MB"}</p>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div><p className="mb-2 text-sm font-medium text-zinc-500">{tp.original || "Original"}</p><img src={preview} alt="Original" className="w-full rounded-xl object-contain border" /></div>
              <div>
                <p className="mb-2 text-sm font-medium text-zinc-500">{tp.result || "Result"}</p>
                <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
                  {status === "done" && resultUrl ? (
                    <img src={resultUrl} alt="Result" className="w-full rounded-xl object-contain" />
                  ) : status === "uploading" ? (
                    <div className="text-center"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" /><p className="mt-2 text-sm text-zinc-500">{t.processing || "Upscaling..."}</p></div>
                  ) : status === "error" ? (
                    <p className="text-sm text-red-500">{errorMsg}</p>
                  ) : (
                    <p className="text-sm text-zinc-400">{t.uploadToSee || "Select scale and upscale to see result"}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">{tp.upscaleFactor || "Upscale Factor"}</label>
              <div className="flex gap-3">
                {["2x", "4x"].map((id) => (
                  <button key={id} onClick={() => setSelectedScale(id)}
                    className={`flex-1 rounded-lg border p-4 text-center transition-all ${selectedScale === id ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20" : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"}`}>
                    <span className="block text-2xl">{id === "2x" ? "🔍" : "🔎"}</span>
                    <span className="mt-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300">{scales[id] || id}</span>
                  </button>
                ))}
              </div>
            </div>

            {status === "idle" && (
              <div className="flex gap-3">
                <button onClick={handleUploadClick}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{t.button || "Upscale Image"} ({CREDIT_COST} {t.cost || "credits"})</button>
                <button onClick={reset}
                  className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{tp.cancel || "Cancel"}</button>
              </div>
            )}

            {status === "done" && resultUrl && (
              <div className="flex gap-3">
                <a href={resultUrl} download target="_blank" rel="noopener noreferrer"
                  className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">{tp.downloadResult || "Download Result"}</a>
                <button onClick={reset}
                  className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{t.tryAnother || "Try Another Image"}</button>
              </div>
            )}

            {status === "error" && (
              <div className="flex gap-3">
                <button onClick={handleUploadClick}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{tp.tryAgain || "Try Again"}</button>
                <button onClick={reset}
                  className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{tp.cancel || "Cancel"}</button>
              </div>
            )}
          </div>
        )}
      </div>

      <CreditConfirmDialog isOpen={showConfirm} creditsNeeded={CREDIT_COST} currentCredits={user?.credits || 0} toolName={t.title || TOOL_ID} locale={locale} onConfirm={handleUpload} onCancel={() => setShowConfirm(false)} />
      {showToast && <CreditsUsedToast creditsUsed={creditsUsed} remaining={user?.credits || 0} onClose={() => setShowToast(false)} />}
    </div>
  );
}
