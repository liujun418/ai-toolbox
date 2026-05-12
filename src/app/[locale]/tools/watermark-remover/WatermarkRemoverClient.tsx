"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { toolsApi } from "@/lib/api";
import { useUsageTracker } from "@/hooks/useUsageTracker";
import { getLocaleFromPathname } from "@/lib/locale";
import { CreditConfirmDialog, CreditsUsedToast } from "@/components/CreditGuard";
import type { Locale } from "@/lib/i18n";

import { getCreditCost } from "@/lib/creditCosts";
const BRUSH_SIZES = [20, 40, 70];
const TOOL_ID = "watermark-remover";

export default function WatermarkRemoverClient({ locale = "en" as Locale, dict }: { locale?: Locale; dict?: Record<string, unknown> }) {
  const CREDIT_COST = getCreditCost(TOOL_ID);
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "marking" | "uploading" | "done" | "error">("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [brushSize, setBrushSize] = useState(40);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const drawingRef = useRef(false);

  const t = (dict as any)?.watermarkRemover || {};
  const tp = (dict as any)?.toolPage || {};
  const nav = (dict as any)?.nav || {};

  useUsageTracker({ toolId: TOOL_ID, toolName: t.title || "Watermark Remover", icon: "🧹", creditsUsed, trigger: creditsUsed > 0 });

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-16 text-center text-zinc-400">{tp.loading || "Loading..."}</div>;
  if (!user) { router.push(`/${locale}/login`); return null; }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    setStatus("marking");
    setResultUrl(null);
    setErrorMsg("");
  }

  const initCanvas = useCallback(() => {
    const img = imgRef.current, canvas = canvasRef.current;
    if (!img || !canvas) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) { ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }, []);

  function getCanvasPos(e: React.MouseEvent | React.TouchEvent): { x: number; y: number } {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width, sy = canvas.height / rect.height;
    if ("touches" in e) return { x: (e.touches[0].clientX - rect.left) * sx, y: (e.touches[0].clientY - rect.top) * sy };
    return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) { e.preventDefault(); drawingRef.current = true; draw(e); }
  function stopDraw() { drawingRef.current = false; }
  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!drawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pos = getCanvasPos(e);
    ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  function clearMask() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  }

  async function getMaskBlob(): Promise<Blob | null> {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const mCtx = maskCanvas.getContext("2d");
    if (!mCtx) return null;
    const imageData = canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height);
    const maskData = mCtx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] > 0) {
        maskData.data[i] = maskData.data[i + 1] = maskData.data[i + 2] = maskData.data[i + 3] = 255;
      }
    }
    mCtx.putImageData(maskData, 0, 0);
    return new Promise<Blob | null>((resolve) => maskCanvas.toBlob((blob) => resolve(blob), "image/png"));
  }

  function handleUploadClick() { if (!file) return; setShowConfirm(true); }

  async function handleUpload() {
    if (!file) return;
    setShowConfirm(false);
    setStatus("uploading");
    setErrorMsg("");
    const maskBlob = await getMaskBlob();
    try {
      const data = await toolsApi.uploadFile(TOOL_ID, file, undefined, maskBlob || undefined);
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
          <Link href={`/${locale}`} className="hover:text-blue-600">{tp.home || "Home"}</Link><span>/</span><span>{t.title || "Watermark Remover"}</span>
          <Link href={`/${locale}`} className="ml-auto text-xs text-blue-600 hover:text-blue-500">← {tp.startOver || "Back to Tools"}</Link>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">🧹 {t.title || "Watermark Remover"}</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t.description || "Erase watermarks, logos, and text from images."} {nav.credits ? `Costs ${nav.credits}:` : "Costs"} <span className="font-semibold text-blue-600">{CREDIT_COST} {t.cost || "credits"}</span>.</p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {!preview ? (
          <div onClick={() => fileRef.current?.click()} className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 py-16 dark:border-zinc-700">
            <svg className="h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
            <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">{tp.uploadPhoto || "Upload an image with watermark"}</p>
            <p className="mt-1 text-xs text-zinc-400">{tp.supportedFormats || "PNG, JPG, WebP — max 5MB"}</p>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>
        ) : status === "done" && resultUrl ? (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div><p className="mb-2 text-sm font-medium text-zinc-500">{tp.original || "Original"}</p><img src={preview} alt="Original" className="w-full rounded-xl object-contain border" /></div>
              <div><p className="mb-2 text-sm font-medium text-zinc-500">{tp.result || "Result"}</p><img src={resultUrl} alt="Result" className="w-full rounded-xl object-contain border" /></div>
            </div>
            <div className="flex gap-3">
              <a href={resultUrl} download target="_blank" rel="noopener noreferrer"
                className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">{tp.downloadResult || "Download Result"}</a>
              <button onClick={reset}
                className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{tp.tryAnother || "Try Another"}</button>
            </div>
          </div>
        ) : status === "uploading" ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.processing || "Removing watermark..."}</p>
            <p className="mt-1 text-xs text-zinc-400">This takes ~10–30 seconds</p>
          </div>
        ) : status === "error" ? (
          <div className="py-8 text-center">
            <p className="mb-4 text-sm text-red-500">{errorMsg}</p>
            <div className="flex justify-center gap-3">
              <button onClick={handleUploadClick} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{tp.tryAgain || "Try Again"}</button>
              <button onClick={reset} className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{tp.cancel || "Cancel"}</button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <p className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">Paint over the watermark — brush: {brushSize}px</p>
              <div className="relative block max-w-full" style={{ lineHeight: 0 }}>
                <img ref={imgRef} src={preview} alt="Mark watermark" className="max-h-[400px] max-w-full rounded-xl border" onLoad={initCanvas} />
                <canvas ref={canvasRef} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw} onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
                  className="absolute inset-0 cursor-crosshair rounded-xl" style={{ touchAction: "none", width: "100%", height: "100%" }} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {BRUSH_SIZES.map((s) => (
                <button key={s} onClick={() => setBrushSize(s)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${brushSize === s ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-300" : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"}`}>
                  {s}px
                </button>
              ))}
              <button onClick={clearMask}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:border-red-300 hover:text-red-600 dark:border-zinc-700 dark:text-zinc-400">
                {tp.cancel || "Clear Marks"}
              </button>
            </div>

            <div className="flex gap-3">
              <button onClick={handleUploadClick}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{t.button || "Remove Watermark"} ({CREDIT_COST} {t.cost || "credits"})</button>
              <button onClick={reset}
                className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{tp.cancel || "Cancel"}</button>
            </div>
          </>
        )}
      </div>

      <CreditConfirmDialog isOpen={showConfirm} creditsNeeded={CREDIT_COST} currentCredits={user?.credits || 0} toolName={t.title || TOOL_ID} locale={locale} onConfirm={handleUpload} onCancel={() => setShowConfirm(false)} />
      {showToast && <CreditsUsedToast creditsUsed={creditsUsed} remaining={user?.credits || 0} onClose={() => setShowToast(false)} />}
    </div>
  );
}
