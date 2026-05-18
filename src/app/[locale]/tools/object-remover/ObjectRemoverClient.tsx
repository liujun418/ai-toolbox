"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useAuth } from "@/lib/auth-context";
import { useTool } from "@/hooks/useTool";
import { ToolSkeleton } from "@/components/LoadingSkeleton";
import { CreditConfirmDialog, CreditsUsedToast, LoginPromptDialog } from "@/components/CreditGuard";
import { getCreditCost } from "@/lib/creditCosts";
import type { Locale } from "@/lib/i18n";

const BRUSH_SIZES = [20, 40, 70];
const TOOL_ID = "object-remover";

export default function ObjectRemoverClient({ locale = "en" as Locale, dict }: { locale?: Locale; dict?: Record<string, unknown> }) {
  const { user, loading } = useAuth();
  const [brushSize, setBrushSize] = useState(40);
  const [maskPixels, setMaskPixels] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const drawingRef = useRef(false);

  const t = ((dict as any)?.tools?.[TOOL_ID] as Record<string, string>) || {};
  const tp = (dict as any)?.toolPage || {};

  const countMaskPixels = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const data = canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height);
    let n = 0;
    for (let i = 3; i < data.data.length; i += 4) if (data.data[i] > 0) n++;
    return n;
  }, []);

  const tool = useTool({
    toolId: TOOL_ID,
    creditCost: getCreditCost(TOOL_ID),
    getMask: async () => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let hasPaint = false;
      for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] > 0) { hasPaint = true; break; }
      }
      if (!hasPaint) return null;
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
      const mCtx = maskCanvas.getContext("2d");
      if (!mCtx) return null;
      const maskData = mCtx.createImageData(canvas.width, canvas.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i + 3] > 0) {
          maskData.data[i] = maskData.data[i + 1] = maskData.data[i + 2] = maskData.data[i + 3] = 255;
        }
      }
      mCtx.putImageData(maskData, 0, 0);
      return new Promise<Blob | null>((resolve) => maskCanvas.toBlob((blob) => resolve(blob), "image/png"));
    },
    locale,
    dict,
  });

  const initCanvas = useCallback(() => {
    const img = imgRef.current, canvas = canvasRef.current;
    if (!img || !canvas) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    setMaskPixels(0);
  }, []);

  const getCanvasPos = useCallback((e: MouseEvent | TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width, sy = canvas.height / rect.height;
    const te = e as TouchEvent;
    if (te.touches && te.touches.length > 0)
      return { x: (te.touches[0].clientX - rect.left) * sx, y: (te.touches[0].clientY - rect.top) * sy };
    if (te.changedTouches && te.changedTouches.length > 0)
      return { x: (te.changedTouches[0].clientX - rect.left) * sx, y: (te.changedTouches[0].clientY - rect.top) * sy };
    const me = e as React.MouseEvent;
    return { x: (me.clientX - rect.left) * sx, y: (me.clientY - rect.top) * sy };
  }, []);

  const doDraw = useCallback((e: MouseEvent | TouchEvent | React.MouseEvent) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const pos = getCanvasPos(e);
    ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
    ctx.lineWidth = brushSize; ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2); ctx.fill();
  }, [brushSize, getCanvasPos]);

  const startDraw = useCallback((e: React.MouseEvent) => { e.preventDefault(); drawingRef.current = true; doDraw(e); }, [doDraw]);
  const stopDraw = useCallback(() => { drawingRef.current = false; }, []);

  // Touch support
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onTouchStart = (e: TouchEvent) => { drawingRef.current = true; doDraw(e); };
    const onTouchMove = (e: TouchEvent) => { doDraw(e); };
    const onTouchEnd = () => { stopDraw(); setMaskPixels(countMaskPixels()); };
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);
    return () => {
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [doDraw, stopDraw, countMaskPixels]);

  const clearMask = useCallback(() => {
    canvasRef.current?.getContext("2d")?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setMaskPixels(0);
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    tool.handleFileChange(e);
    clearMask();
  }, [tool.handleFileChange, clearMask]);

  const handleProcess = useCallback(() => {
    tool.handleUpload({});
  }, [tool.handleUpload]);

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
            <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">{tp.uploadPhoto || "Upload a photo with unwanted objects"}</p>
            <p className="mt-1 text-xs text-zinc-400">{tp.supportedFormats || "PNG, JPG, WebP — max 10MB"}</p>
            <input ref={tool.fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>
        ) : tool.status === "done" && tool.resultUrl ? (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div><p className="mb-2 text-sm font-medium text-zinc-500">{tp.original || "Original"}</p><img src={tool.preview} alt="Original" className="w-full rounded-xl border object-contain" /></div>
              <div><p className="mb-2 text-sm font-medium text-zinc-500">{tp.result || "Result"}</p><img src={tool.resultUrl} alt="Result" className="w-full rounded-xl border object-contain" /></div>
            </div>
            <div className="flex gap-3">
              <a href={tool.resultUrl} download target="_blank" rel="noopener noreferrer"
                className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">{tp.downloadResult || "Download Result"}</a>
              <button onClick={tool.reset}
                className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{tp.tryAnother || "Try Another"}</button>
            </div>
          </div>
        ) : tool.status === "uploading" ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.generating || "Removing objects..."}</p>
            <p className="mt-1 text-xs text-zinc-400">Inpainting takes ~15–30 seconds</p>
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
            {maskPixels === 0 && tool.status === "idle" && (
              <div className="mb-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                Paint over unwanted objects, people, or text to remove them. The AI will fill the area naturally.
              </div>
            )}
            <div>
              <p className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Paint over objects to remove — brush: {brushSize}px
                {maskPixels > 0 && <span className="ml-1 text-green-600">({maskPixels.toLocaleString()} px marked)</span>}
              </p>
              <div className="relative inline-block max-w-full" style={{ lineHeight: 0 }}>
                <img ref={imgRef} src={tool.preview} alt="Mark objects to remove" className="max-h-[400px] max-w-full rounded-xl border" onLoad={initCanvas} />
                <canvas ref={canvasRef} onMouseDown={startDraw} onMouseMove={doDraw} onMouseUp={() => { stopDraw(); setMaskPixels(countMaskPixels()); }} onMouseLeave={() => { stopDraw(); setMaskPixels(countMaskPixels()); }}
                  className="absolute inset-0 cursor-crosshair rounded-xl" style={{ touchAction: "none", width: "100%", height: "100%" }} />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {BRUSH_SIZES.map((s) => (
                <button key={s} onClick={() => setBrushSize(s)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${brushSize === s ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-300" : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"}`}>
                  {s}px
                </button>
              ))}
              <button onClick={clearMask}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:border-red-300 hover:text-red-600 dark:border-zinc-700 dark:text-zinc-400">
                {t.clearMask || "Clear Mask"}
              </button>
            </div>

            <div className="mt-4 flex gap-3">
              <button onClick={handleProcess}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700">
                {t.button || `Remove Objects (${getCreditCost(TOOL_ID)} credits)`}
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
