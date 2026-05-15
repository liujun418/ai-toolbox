"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useUsageTracker } from "@/hooks/useUsageTracker";
import { authApi } from "@/lib/api";
import { validateImageFile } from "@/lib/fileValidation";
import { CreditConfirmDialog, CreditsUsedToast, LoginPromptDialog } from "@/components/CreditGuard";
import { ToolSkeleton } from "@/components/LoadingSkeleton";
import type { Locale } from "@/lib/i18n";

const TOOL_ID = "ai-image-generator";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

const QUALITIES = ["low", "medium", "high"] as const;
type Quality = (typeof QUALITIES)[number];
const ASPECT_RATIOS = ["1:1", "3:2", "2:3"] as const;
type AspectRatio = (typeof ASPECT_RATIOS)[number];
const FORMATS = ["png", "webp", "jpeg"] as const;
type Format = (typeof FORMATS)[number];

function calcCredits(quality: Quality, numImages: number, hasReference: boolean): number {
  const base = { low: 1, medium: 2, high: 3 }[quality];
  const extra = Math.max(0, numImages - 1);
  const ref = hasReference ? 1 : 0;
  return base + extra + ref;
}

export default function AiImageGeneratorClient({ locale = "en" as Locale, dict }: { locale?: Locale; dict?: Record<string, unknown> }) {
  const { user, loading, updateUser } = useAuth();
  const t = (dict as any)?.aiImageGenerator || {};
  const tp = (dict as any)?.toolPage || {};

  const [prompt, setPrompt] = useState("");
  const [quality, setQuality] = useState<Quality>("medium");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [format, setFormat] = useState<Format>("png");
  const [numImages, setNumImages] = useState(1);
  const [refFile, setRefFile] = useState<File | null>(null);
  const [refPreview, setRefPreview] = useState<string | null>(null);
  const [refError, setRefError] = useState<string | null>(null);

  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [resultUrls, setResultUrls] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const creditsNeeded = calcCredits(quality, numImages, !!refFile);

  useUsageTracker({
    toolId: TOOL_ID,
    toolName: t.title || "AI Image Generator",
    icon: "🎨",
    creditsUsed,
    trigger: creditsUsed > 0,
  });

  const handleRefChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateImageFile(f);
    if (err) {
      setRefError(err);
      setRefFile(null);
      setRefPreview(null);
      return;
    }
    setRefError(null);
    setRefFile(f);
    setRefPreview(URL.createObjectURL(f));
    setStatus("idle");
    setResultUrls([]);
    setErrorMsg("");
  }, []);

  const removeReference = useCallback(() => {
    if (refPreview) URL.revokeObjectURL(refPreview);
    setRefFile(null);
    setRefPreview(null);
    setRefError(null);
    if (fileRef.current) fileRef.current.value = "";
  }, [refPreview]);

  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) return;
    if (!user) { setShowLoginPrompt(true); return; }
    setShowConfirm(true);
  }, [prompt, user]);

  const doGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    setShowConfirm(false);
    setStatus("uploading");
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const formData = new FormData();
      if (refFile) formData.append("file", refFile);
      formData.append("prompt", prompt.trim());
      formData.append("quality", quality);
      formData.append("aspect_ratio", aspectRatio);
      formData.append("output_format", format);
      formData.append("num_images", String(numImages));

      const res = await fetch(`${API_BASE}/api/upload/${TOOL_ID}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Upload failed" }));
        const msg = err.detail || err.message || "Upload failed";
        if (res.status === 402) {
          setShowConfirm(false);
          throw new Error(msg);
        }
        throw new Error(msg);
      }

      const data = await res.json();

      if (!data.output_file_url) {
        setStatus("error");
        setErrorMsg(data.error_message || t.noImages || "The AI couldn't generate images. Try a different prompt.");
        return;
      }

      // Parse result URLs from result_content (JSON array) or use single URL
      let urls: string[] = [data.output_file_url];
      if (data.result_content) {
        try {
          const parsed = JSON.parse(data.result_content);
          if (Array.isArray(parsed) && parsed.length > 0) {
            urls = parsed;
          }
        } catch { /* use single URL fallback */ }
      }

      setStatus("done");
      setResultUrls(urls);
      const cost = data.credits_used || creditsNeeded;
      setCreditsUsed(cost);

      // Optimistic credit update
      updateUser((prev) => ({ credits: prev.credits - cost }));
      authApi.me().then((u) => updateUser(u)).catch(() => {});
      setShowToast(true);
    } catch (err) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Something went wrong";
      if (msg.includes("Not enough credits")) {
        setErrorMsg(`Not enough credits. You need ${creditsNeeded}, but have ${user?.credits || 0}.`);
      } else if (msg.includes("File too large")) {
        setErrorMsg("Reference image is too large. Maximum size is 3MB.");
      } else if (msg.includes("description")) {
        setErrorMsg("Please provide a text description of the image you want to generate.");
      } else {
        setErrorMsg(msg);
      }
    }
  }, [prompt, quality, aspectRatio, format, numImages, refFile, creditsNeeded, user, updateUser, t]);

  const reset = useCallback(() => {
    setPrompt("");
    setStatus("idle");
    setResultUrls([]);
    setErrorMsg("");
    setCreditsUsed(0);
    setShowToast(false);
    removeReference();
  }, [removeReference]);

  if (loading) return <ToolSkeleton />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href={`/${locale}`} className="hover:text-blue-600">{tp.home || "Home"}</Link>
          <span>/</span>
          <span>{t.title || "AI Image Generator"}</span>
          <Link href={`/${locale}`} className="ml-auto text-xs text-blue-600 hover:text-blue-500">← {tp.startOver || "Back to Tools"}</Link>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">🎨 {t.title || "AI Image Generator"}</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{t.description || "Turn text into stunning AI images."}</p>
        <div className="mt-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-50 to-yellow-100 px-3 py-1 text-sm font-semibold text-amber-800 shadow-sm ring-1 ring-amber-200/60 dark:from-amber-900/20 dark:to-yellow-900/20 dark:text-amber-300 dark:ring-amber-700/40">
            💎 {t.cost || "from 1 credit"}
          </span>
        </div>
      </div>

      {/* Error display */}
      {errorMsg && status === "error" && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          <p className="font-semibold">{t.errorTitle || "Generation Failed"}</p>
          <p className="mt-1">{errorMsg}</p>
        </div>
      )}

      {/* Main card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {/* Prompt input — always visible */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {t.promptLabel || "Describe the image you want"}
          </label>
          <div className="flex gap-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t.promptPlaceholder || "A majestic mountain landscape at golden hour..."}
              rows={3}
              maxLength={2000}
              disabled={status === "uploading"}
              className="flex-1 resize-none rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || status === "uploading"}
              className="shrink-0 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              {status === "uploading" ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {t.generating || "Generating..."}
                </span>
              ) : (
                t.generateButton || "Generate Image"
              )}
            </button>
          </div>
          <p className="mt-1 text-right text-xs text-zinc-400">{prompt.length}/2000</p>
        </div>

        {/* Parameter grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Quality */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">{t.qualityLabel || "Quality"}</label>
            <div className="space-y-1">
              {QUALITIES.map((q) => {
                const info = t.quality?.[q] || {};
                return (
                  <button key={q} onClick={() => { setQuality(q); setStatus("idle"); }}
                    disabled={status === "uploading"}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-all disabled:opacity-50 ${
                      quality === q ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20" : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                    }`}>
                    <span className={`font-semibold ${quality === q ? "text-blue-700 dark:text-blue-300" : "text-zinc-700 dark:text-zinc-300"}`}>
                      {info.label || q}
                    </span>
                    <span className="ml-1 text-xs text-zinc-500 dark:text-zinc-400">{info.desc || ""}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">{t.aspectRatioLabel || "Aspect Ratio"}</label>
            <div className="space-y-1">
              {ASPECT_RATIOS.map((ar) => (
                <button key={ar} onClick={() => { setAspectRatio(ar); setStatus("idle"); }}
                  disabled={status === "uploading"}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-all disabled:opacity-50 ${
                    aspectRatio === ar ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20" : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                  }`}>
                  <span className={`font-semibold ${aspectRatio === ar ? "text-blue-700 dark:text-blue-300" : "text-zinc-700 dark:text-zinc-300"}`}>
                    {t.aspectRatio?.[ar] || ar}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">{t.formatLabel || "Format"}</label>
            <div className="space-y-1">
              {FORMATS.map((f) => (
                <button key={f} onClick={() => { setFormat(f); setStatus("idle"); }}
                  disabled={status === "uploading"}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-all disabled:opacity-50 ${
                    format === f ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20" : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                  }`}>
                  <span className={`font-semibold ${format === f ? "text-blue-700 dark:text-blue-300" : "text-zinc-700 dark:text-zinc-300"}`}>
                    {f.toUpperCase()}
                  </span>
                  <span className="ml-1 text-xs text-zinc-500 dark:text-zinc-400">{t.format?.[f] || ""}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Image Count + Reference */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">{t.imagesLabel || "Images"}</label>
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4].map((n) => (
                <button key={n} onClick={() => { setNumImages(n); setStatus("idle"); }}
                  disabled={status === "uploading"}
                  className={`flex-1 rounded-lg border px-2 py-2 text-center text-sm font-semibold transition-all disabled:opacity-50 ${
                    numImages === n ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-300" : "border-zinc-200 text-zinc-700 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600"
                  }`}>
                  {n}
                </button>
              ))}
            </div>

            {/* Reference image */}
            <label className="mb-1 block text-xs font-semibold text-zinc-600 dark:text-zinc-400">{t.referenceLabel || "Reference Image"}</label>
            {refPreview ? (
              <div className="relative inline-block">
                <img src={refPreview} alt="Reference" className="h-16 w-16 rounded-lg border object-cover" />
                <button onClick={removeReference} disabled={status === "uploading"}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600 disabled:opacity-50">
                  ×
                </button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()} disabled={status === "uploading"}
                className="w-full rounded-lg border border-dashed border-zinc-300 px-3 py-2 text-xs text-zinc-500 hover:border-zinc-400 hover:text-zinc-600 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500">
                {t.uploadReference || "Click to upload reference"}
              </button>
            )}
            {refError && <p className="mt-1 text-xs text-red-500">{refError}</p>}
            <p className="mt-1 text-xs text-zinc-400">{t.referenceDesc || "Adds 1 extra credit"}</p>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleRefChange} className="hidden" />
          </div>
        </div>

        {/* Credit summary */}
        <div className="mt-6 flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800/50">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {creditsNeeded} {t.creditSummary || "credits for this generation"}
          </span>
          {status === "idle" && !resultUrls.length && (
            <button onClick={handleGenerate} disabled={!prompt.trim()}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
              {t.generateButton || "Generate Image"}
            </button>
          )}
        </div>

        {/* Results */}
        {status === "uploading" && (
          <div className="mt-8 flex flex-col items-center justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
            <p className="mt-4 text-sm text-zinc-500">{t.generating || "Generating your image..."}</p>
            <p className="mt-1 text-xs text-zinc-400">This may take 10-30 seconds</p>
          </div>
        )}

        {status === "done" && resultUrls.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
              {resultUrls.length === 1 ? (t.result || "Your Generated Image") : (t.results || "Your Generated Images")}
            </h3>
            <div className={`grid gap-4 ${resultUrls.length === 1 ? "grid-cols-1" : resultUrls.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
              {resultUrls.map((url, i) => (
                <div key={i} className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                  <img src={url} alt={`Generated ${i + 1}`} className="w-full object-cover" />
                  <div className="absolute inset-0 flex items-end justify-end p-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <a href={url} download target="_blank" rel="noopener noreferrer"
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-green-700">
                      {tp.downloadResult || "Download"}
                    </a>
                  </div>
                </div>
              ))}
            </div>
            {resultUrls.length > 1 && (
              <div className="mt-4 text-center">
                <span className="text-xs text-zinc-400">{t.downloadAll || "Hover over each image to download"}</span>
              </div>
            )}
            <div className="mt-6 flex gap-3">
              <button onClick={reset}
                className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">
                {t.tryAnother || "Generate Another"}
              </button>
            </div>
          </div>
        )}

        {status === "error" && resultUrls.length === 0 && (
          <div className="mt-8 flex flex-col items-center py-8">
            <p className="text-sm text-red-500">{errorMsg}</p>
            <button onClick={() => doGenerate()}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              {tp.tryAgain || "Try Again"}
            </button>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-8 rounded-xl border border-blue-200/80 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 text-sm shadow-sm dark:border-blue-800/60 dark:from-blue-950/30 dark:to-indigo-950/20">
        <p className="flex items-center gap-1.5 font-semibold text-blue-800 dark:text-blue-300">
          <span className="text-base">💡</span> {t.tipsTitle || "Pro Tips"}
        </p>
        <div className="mt-3 space-y-2">
          {(t.tips || []).map((tip: any, i: number) => {
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

      {/* Credit confirmation dialog */}
      <CreditConfirmDialog
        isOpen={!!user && showConfirm}
        creditsNeeded={creditsNeeded}
        currentCredits={user?.credits || 0}
        toolName={t.title || "AI Image Generator"}
        locale={locale}
        dict={dict}
        onConfirm={doGenerate}
        onCancel={() => setShowConfirm(false)}
      />

      {/* Login prompt */}
      <LoginPromptDialog isOpen={showLoginPrompt} locale={locale} dict={dict} />

      {/* Credits used toast */}
      {showToast && (
        <CreditsUsedToast
          creditsUsed={creditsUsed}
          remaining={user?.credits ?? 0}
          onClose={() => setShowToast(false)}
          dict={dict}
        />
      )}
    </div>
  );
}
