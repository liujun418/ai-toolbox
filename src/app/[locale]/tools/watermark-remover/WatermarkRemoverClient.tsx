"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useTool } from "@/hooks/useTool";
import { ToolSkeleton } from "@/components/LoadingSkeleton";
import { CreditConfirmDialog, CreditsUsedToast, LoginPromptDialog } from "@/components/CreditGuard";
import type { Locale } from "@/lib/i18n";

import { getCreditCost } from "@/lib/creditCosts";
const BRUSH_SIZES = [60, 120, 200];
const TOOL_ID = "watermark-remover";
const MAX_RES = 2048;

export default function WatermarkRemoverClient({ locale = "en" as Locale, dict }: { locale?: Locale; dict?: Record<string, unknown> }) {
  const { user, loading } = useAuth();
  const [brushSize, setBrushSize] = useState(120);
  const [maskPixels, setMaskPixels] = useState(0);
  const [maskPreviewUrl, setMaskPreviewUrl] = useState<string | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null); // hidden canvas holding the clean image
  const drawingRef = useRef(false);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imageDataRef = useRef<ImageData | null>(null); // clean background for redraw

  // Load image into canvas
  const loadImage = useCallback((file: File) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = new Image();
    img.onload = () => {
      // Cap resolution
      let w = img.naturalWidth, h = img.naturalHeight;
      if (Math.max(w, h) > MAX_RES) {
        const r = MAX_RES / Math.max(w, h);
        w = Math.round(w * r);
        h = Math.round(h * r);
      }
      canvas.width = w;
      canvas.height = h;

      // Draw image onto canvas
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, w, h);
      ctxRef.current = ctx;

      // Store clean background
      imageDataRef.current = ctx.getImageData(0, 0, w, h);

      // Also keep a hidden copy for mask generation
      const bg = document.createElement("canvas");
      bg.width = w; bg.height = h;
      const bgCtx = bg.getContext("2d");
      if (bgCtx) bgCtx.drawImage(img, 0, 0, w, h);
      bgCanvasRef.current = bg;

      setMaskPixels(0);
      setCanvasReady(true);
    };
    img.src = URL.createObjectURL(file);
  }, []);

  const tool = useTool({
    toolId: TOOL_ID,
    creditCost: getCreditCost(TOOL_ID),
    getMask: async () => {
      const main = canvasRef.current;
      const bg = bgCanvasRef.current;
      if (!main || !bg) { console.log("[WM] getMask: no canvas"); return null; }
      const w = main.width, h = main.height;
      if (w === 0 || h === 0) { console.log("[WM] getMask: zero size"); return null; }

      // Get current painted state
      const ctx = main.getContext("2d", { willReadFrequently: true });
      if (!ctx) return null;
      const currentData = ctx.getImageData(0, 0, w, h);

      // Get clean background
      const bgCtx = bg.getContext("2d", { willReadFrequently: true });
      if (!bgCtx) return null;
      const bgData = bgCtx.getImageData(0, 0, w, h);

      // Compare: any pixel that differs from background = paint
      let whiteCount = 0;
      const maskData = new ImageData(w, h);
      for (let i = 0; i < currentData.data.length; i += 4) {
        const cr = currentData.data[i], cg = currentData.data[i + 1], cb = currentData.data[i + 2];
        const br = bgData.data[i], bg_g = bgData.data[i + 1], bb = bgData.data[i + 2];
        // If pixel differs from clean background → user painted here
        if (Math.abs(cr - br) > 20 || Math.abs(cg - bg_g) > 20 || Math.abs(cb - bb) > 20) {
          maskData.data[i] = maskData.data[i + 1] = maskData.data[i + 2] = maskData.data[i + 3] = 255;
          whiteCount++;
        }
      }
      if (whiteCount === 0) { console.log("[WM] getMask: no paint diff"); return null; }

      // Create mask canvas and dilate
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = w; maskCanvas.height = h;
      const mCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
      if (!mCtx) return null;
      mCtx.putImageData(maskData, 0, 0);

      // Dilate
      mCtx.filter = "blur(8px)";
      mCtx.drawImage(maskCanvas, 0, 0);
      mCtx.filter = "none";
      const dilated = mCtx.getImageData(0, 0, w, h);
      let dilatedWhite = 0;
      for (let i = 0; i < dilated.data.length; i += 4) {
        if (dilated.data[i] > 10) {
          dilated.data[i] = dilated.data[i + 1] = dilated.data[i + 2] = dilated.data[i + 3] = 255;
          dilatedWhite++;
        }
      }
      mCtx.putImageData(dilated, 0, 0);
      console.log("[WM] getMask: " + w + "x" + h + ", white=" + whiteCount + " → dilated=" + dilatedWhite);

      const previewUrl = maskCanvas.toDataURL("image/png");
      setMaskPreviewUrl(previewUrl);

      return new Promise<Blob | null>((resolve) => maskCanvas.toBlob((blob) => {
        console.log("[WM] getMask: blob=" + (blob?.size || 0));
        resolve(blob);
      }, "image/png"));
    },
    locale,
    dict,
  });

  const t = (dict as any)?.watermarkRemover || {};
  const tp = (dict as any)?.toolPage || {};

  const getCanvasPos = useCallback((e: MouseEvent | TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const te = e as TouchEvent;
    if (te.touches?.length || te.changedTouches?.length) {
      const t = te.touches?.[0] || te.changedTouches?.[0];
      if (!t) return { x: 0, y: 0 };
      return {
        x: (t.clientX - rect.left) * (canvas.width / rect.width),
        y: (t.clientY - rect.top) * (canvas.height / rect.height),
      };
    }
    // Mouse: use offset from canvas element scaled to natural size
    const ne = (e as React.MouseEvent).nativeEvent || (e as MouseEvent);
    return {
      x: ne.offsetX * (canvas.width / rect.width),
      y: ne.offsetY * (canvas.height / rect.height),
    };
  }, []);

  const doDraw = useCallback((e: MouseEvent | TouchEvent | React.MouseEvent) => {
    if (!drawingRef.current) return;
    e.preventDefault?.();
    const ctx = ctxRef.current;
    if (!ctx) return;
    const pos = getCanvasPos(e);
    ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }, [brushSize, getCanvasPos]);

  const startDraw = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    drawingRef.current = true;
    doDraw(e);
  }, [doDraw]);

  const stopDraw = useCallback(() => {
    drawingRef.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    // Count painted pixels by comparing with clean background
    const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const bgData = imageDataRef.current;
    if (!bgData) return;
    let n = 0;
    for (let i = 0; i < currentData.data.length; i += 4) {
      if (Math.abs(currentData.data[i] - bgData.data[i]) > 20 ||
          Math.abs(currentData.data[i + 1] - bgData.data[i + 1]) > 20 ||
          Math.abs(currentData.data[i + 2] - bgData.data[i + 2]) > 20) {
        n++;
      }
    }
    setMaskPixels(n);
  }, []);

  // Native touch listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ts = (e: TouchEvent) => { e.preventDefault(); drawingRef.current = true; doDraw(e); };
    const tm = (e: TouchEvent) => { e.preventDefault(); doDraw(e); };
    const te = (e: TouchEvent) => { e.preventDefault(); stopDraw(); };
    canvas.addEventListener("touchstart", ts, { passive: false });
    canvas.addEventListener("touchmove", tm, { passive: false });
    canvas.addEventListener("touchend", te, { passive: false });
    return () => {
      canvas.removeEventListener("touchstart", ts);
      canvas.removeEventListener("touchmove", tm);
      canvas.removeEventListener("touchend", te);
    };
  }, [doDraw, stopDraw]);

  const clearMask = useCallback(() => {
    const canvas = canvasRef.current;
    const bg = imageDataRef.current;
    if (!canvas || !bg) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.putImageData(bg, 0, 0);
    ctxRef.current = ctx;
    setMaskPixels(0);
    setMaskPreviewUrl(null);
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setCanvasReady(false);
    setMaskPreviewUrl(null);
    loadImage(f);
    tool.handleFileChange(e);
  }, [loadImage, tool.handleFileChange]);

  const handleProcess = useCallback(() => {
    tool.handleUpload({});
  }, [tool.handleUpload]);

  if (loading) return <ToolSkeleton />;

  const showLoginPrompt = !user && tool.showConfirm;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href={`/${locale}`} className="hover:text-blue-600">{tp.home || "Home"}</Link><span>/</span><span>{t.title || "Watermark Remover"}</span>
          <Link href={`/${locale}`} className="ml-auto text-xs text-blue-600 hover:text-blue-500">← {tp.startOver || "Back to Tools"}</Link>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">{t.title || "Watermark Remover"}</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t.description || "Erase watermarks, logos, and text from images."} <span className="font-semibold text-blue-600">{t.cost || `${getCreditCost(TOOL_ID)} credits`}</span>.</p>
      </div>

      {tool.fileError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{tool.fileError}</div>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {!canvasReady ? (
          <div onClick={() => tool.fileRef.current?.click()} className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 py-16 dark:border-zinc-700">
            <svg className="h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>
            <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">{tp.uploadPhoto || "Upload an image with watermark"}</p>
            <p className="mt-1 text-xs text-zinc-400">{tp.supportedFormats || "PNG, JPG, WebP — max 10MB"}</p>
            <input ref={tool.fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden"/>
          </div>
        ) : tool.status === "done" && tool.resultUrl ? (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div><p className="mb-2 text-sm font-medium text-zinc-500">{tp.original || "Original"}</p><img src={tool.preview ?? undefined} alt="Original" className="w-full rounded-xl object-contain border"/></div>
              <div><p className="mb-2 text-sm font-medium text-zinc-500">{tp.result || "Result"}</p><img src={tool.resultUrl} alt="Result" className="w-full rounded-xl object-contain border"/></div>
            </div>
            {maskPreviewUrl && (
              <div>
                <p className="mb-2 text-sm font-medium text-zinc-500">Mask sent to backend</p>
                <div className="rounded-xl border bg-zinc-100 dark:bg-zinc-800 p-2">
                  <img src={maskPreviewUrl} alt="Mask preview" className="max-h-[200px] rounded" />
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <a href={tool.resultUrl} download target="_blank" rel="noopener noreferrer"
                className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">{tp.downloadResult || "Download Result"}</a>
              <button onClick={tool.reset}
                className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{tp.tryAnother || "Try Another"}</button>
            </div>
          </div>
        ) : tool.status === "uploading" ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"/>
            <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.processing || "Removing watermark..."}</p>
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
            {maskPixels === 0 && (
              <div className="mb-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                Paint over the watermark/logo/text for precise removal, or click Remove and AI will auto-detect.
              </div>
            )}
            <div>
              <p className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Paint over the watermark — brush: {brushSize}px
                {maskPixels > 0 && <span className="ml-1 text-green-600">({maskPixels.toLocaleString()} px marked)</span>}
              </p>
              <div className="max-w-full">
                <canvas ref={canvasRef}
                  onMouseDown={startDraw}
                  onMouseMove={doDraw}
                  onMouseUp={stopDraw}
                  onMouseLeave={stopDraw}
                  className="max-h-[400px] max-w-full cursor-crosshair rounded-xl border"
                  style={{ touchAction: "none", display: "block" }}/>
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
                {t.clearMarks || "Clear Marks"}
              </button>
            </div>

            <div className="mt-4 flex gap-3">
              <button onClick={handleProcess}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700">
                {t.button || `Remove Watermark (${getCreditCost(TOOL_ID)} credits)`}
              </button>
              <button onClick={tool.reset}
                className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{tp.cancel || "Cancel"}</button>
            </div>
          </>
        )}
      </div>

      <CreditConfirmDialog isOpen={!!user && tool.showConfirm} creditsNeeded={getCreditCost(TOOL_ID)} currentCredits={user?.credits || 0} toolName={t.title || TOOL_ID} locale={locale} dict={dict} onConfirm={handleProcess} onCancel={() => tool.setShowConfirm(false)}/>
      <LoginPromptDialog isOpen={showLoginPrompt} locale={locale} dict={dict} />
      {tool.showToast && <CreditsUsedToast creditsUsed={tool.creditsUsed} remaining={user?.credits ?? 0} onClose={() => tool.setShowToast(false)} dict={dict}/>}
    </div>
  );
}
