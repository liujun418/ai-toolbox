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
const TOOL_ID = "background-remover";
const BRUSH_SIZES = [20, 40, 60];

type Mode = "auto" | "manual";

export default function BackgroundRemoverClient({ locale = "en" as Locale, dict }: { locale?: Locale; dict?: Record<string, unknown> }) {
  const CREDIT_COST = getCreditCost(TOOL_ID);
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("auto");
  const [brushSize, setBrushSize] = useState(40);
  const [status, setStatus] = useState<"idle" | "marking" | "uploading" | "done" | "error">("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [maskPixels, setMaskPixels] = useState(0);
  const [userPrompt, setUserPrompt] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const drawRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const drawingRef = useRef(false);

  const t = (dict as any)?.backgroundRemover || {};
  const tp = (dict as any)?.toolPage || {};
  const nav = (dict as any)?.nav || {};

  useUsageTracker({ toolId: TOOL_ID, toolName: t.title || "Background Remover", icon: "✂️", creditsUsed, trigger: creditsUsed > 0 });

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-16 text-center text-zinc-400">{tp.loading || "Loading..."}</div>;
  if (!user) { router.push(`/${locale}/login`); return null; }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    setStatus(mode === "manual" ? "marking" : "idle");
    setResultUrl(null); setErrorMsg(""); setMaskPixels(0);
  }

  const initCanvas = useCallback(() => {
    const img = imgRef.current, d = drawRef.current, m = maskRef.current;
    if (!img || !d || !m) return;
    d.width = m.width = img.naturalWidth;
    d.height = m.height = img.naturalHeight;
    d.getContext("2d")!.clearRect(0, 0, d.width, d.height);
    m.getContext("2d")!.clearRect(0, 0, m.width, m.height);
    setMaskPixels(0);
  }, []);

  function canvasPos(e: React.MouseEvent | React.TouchEvent) {
    const c = drawRef.current!;
    const r = c.getBoundingClientRect();
    const sx = c.width / r.width, sy = c.height / r.height;
    if ("touches" in e) return { x: (e.touches[0].clientX - r.left) * sx, y: (e.touches[0].clientY - r.top) * sy };
    return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy };
  }
  function startDraw(e: React.MouseEvent | React.TouchEvent) { e.preventDefault(); drawingRef.current = true; draw(e); }
  function stopDraw() { drawingRef.current = false; }
  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!drawingRef.current) return; e.preventDefault();
    const ctx = drawRef.current?.getContext("2d"); if (!ctx) return;
    const p = canvasPos(e);
    ctx.fillStyle = "rgba(0,220,80,0.7)"; ctx.lineWidth = brushSize; ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(p.x, p.y, brushSize/2, 0, Math.PI*2); ctx.fill();
  }
  function updateMaskCount() {
    const d = drawRef.current; if (!d) return;
    const data = d.getContext("2d")!.getImageData(0, 0, d.width, d.height);
    let n = 0; for (let i = 3; i < data.data.length; i += 4) if (data.data[i] > 0) n++;
    setMaskPixels(n);
  }

  function getKeepMask(): Promise<Blob | null> {
    return new Promise((resolve) => {
      const d = drawRef.current, m = maskRef.current;
      if (!d || !m) return resolve(null);
      const dCtx = d.getContext("2d"), mCtx = m.getContext("2d");
      if (!dCtx || !mCtx) return resolve(null);
      const imgData = dCtx.getImageData(0, 0, d.width, d.height);
      const maskData = mCtx.createImageData(d.width, d.height);
      let count = 0;
      for (let i = 0; i < imgData.data.length; i += 4) {
        if (imgData.data[i + 3] > 0) {
          maskData.data[i] = maskData.data[i+1] = maskData.data[i+2] = maskData.data[i+3] = 255;
          count++;
        }
      }
      if (count === 0) return resolve(null);
      mCtx.putImageData(maskData, 0, 0);
      m.toBlob(b => resolve(b), "image/png");
    });
  }

  function handleUploadClick() { if (!file) return; setShowConfirm(true); }
  async function handleUpload() {
    if (!file) return;
    setShowConfirm(false); setStatus("uploading"); setErrorMsg("");
    try {
      const keepMask = mode === "manual" ? await getKeepMask() : null;
      const prompt = mode === "manual" && userPrompt.trim() ? `Keep only: ${userPrompt.trim()}` : undefined;
      const data = await toolsApi.uploadFile(TOOL_ID, file, prompt, keepMask || undefined);
      if (!data.output_file_url) { setStatus("error"); setErrorMsg("Processing failed."); return; }
      setStatus("done"); setResultUrl(data.output_file_url);
      setCreditsUsed(data.credits_used || CREDIT_COST); setShowToast(true);
    } catch (err) {
      setStatus("error"); setErrorMsg(err instanceof Error ? err.message : "Unknown error");
    }
  }

  function reset() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null); setFile(null); setResultUrl(null); setStatus("idle"); setErrorMsg(""); setMaskPixels(0);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href={`/${locale}`} className="hover:text-blue-600">{tp.home || "Home"}</Link><span>/</span><span>{t.title || "Background Remover"}</span>
          <Link href={`/${locale}`} className="ml-auto text-xs text-blue-600 hover:text-blue-500">← {tp.startOver || "Back to Tools"}</Link>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">✂️ {t.title || "Background Remover"}</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t.description || "Remove image backgrounds instantly with AI."} {nav.credits ? `Costs ${nav.credits}:` : "Costs"} <span className="font-semibold text-blue-600">{CREDIT_COST} {t.cost || "credits"}</span>.</p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {!preview ? (
          <div onClick={() => fileRef.current?.click()} className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 py-16 dark:border-zinc-700">
            <svg className="h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>
            <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">{tp.clickToUpload || "Click to upload"}</p>
            <p className="mt-1 text-xs text-zinc-400">{tp.supportedFormats || "PNG, JPG, WebP — max 5MB"}</p>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden"/>
          </div>
        ) : status === "done" && resultUrl ? (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div><p className="mb-2 text-sm font-medium text-zinc-500">{tp.original || "Original"}</p><img src={preview} alt="Original" className="w-full rounded-xl object-contain border"/></div>
              <div><p className="mb-2 text-sm font-medium text-zinc-500">{tp.result || "Result"}</p><img src={resultUrl} alt="Result" className="w-full rounded-xl object-contain border checkerboard"/></div>
            </div>
            <div className="flex gap-3">
              <a href={resultUrl} download target="_blank" rel="noopener noreferrer" className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">{t.download || tp.downloadResult || "Download"}</a>
              <button onClick={reset} className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{t.tryAnother || tp.startOver || "Try Another"}</button>
            </div>
          </div>
        ) : status === "uploading" ? (
          <div className="py-16 text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"/><p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.processing || "Processing..."}</p></div>
        ) : status === "error" ? (
          <div className="py-8 text-center"><p className="mb-4 text-sm text-red-500">{errorMsg}</p><div className="flex justify-center gap-3"><button onClick={handleUploadClick} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{tp.tryAgain || "Try Again"}</button><button onClick={reset} className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">{tp.cancel || "Cancel"}</button></div></div>
        ) : (
          <div className="space-y-6">
            <div className="flex gap-2">
              <button onClick={() => { setMode("auto"); setStatus("idle"); setMaskPixels(0); }} className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${mode==="auto"?"border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-300":"border-zinc-200 text-zinc-600"}`}>🤖 Auto Detect</button>
              <button onClick={() => { setMode("manual"); setStatus("marking"); }} className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${mode==="manual"?"border-green-600 bg-green-50 text-green-700 dark:border-green-500 dark:bg-green-900/20 dark:text-green-300":"border-zinc-200 text-zinc-600"}`}>✋ Manual Keep</button>
            </div>

            {mode === "manual" && (
              <div>
                <p className="mb-2 text-sm font-medium text-zinc-500">Paint <strong className="text-green-600">KEEP</strong> area — brush {brushSize}px {maskPixels > 0 && <span className="text-green-600">({maskPixels} px marked)</span>}</p>
                <div className="relative inline-block max-w-full" style={{ lineHeight: 0 }}>
                  <img ref={imgRef} src={preview!} alt="mark" className="max-h-[380px] max-w-full rounded-xl border" onLoad={initCanvas}/>
                  <canvas ref={drawRef} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={(e) => { stopDraw(); updateMaskCount(); }} onMouseLeave={stopDraw} onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={(e) => { stopDraw(); updateMaskCount(); }} className="absolute inset-0 cursor-crosshair rounded-xl" style={{ touchAction: "none", width: "100%", height: "100%" }}/>
                </div>
                <canvas ref={maskRef} className="hidden"/>
                <div className="mt-3 flex gap-2">
                  {BRUSH_SIZES.map(s => <button key={s} onClick={() => setBrushSize(s)} className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${brushSize===s?"border-green-600 bg-green-50 text-green-700 dark:border-green-500 dark:bg-green-900/20 dark:text-green-300":"border-zinc-200 text-zinc-600"}`}>{s}px</button>)}
                  <button onClick={() => { drawRef.current?.getContext("2d")?.clearRect(0,0,drawRef.current.width,drawRef.current.height); setMaskPixels(0); }} className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-500 hover:border-red-300 hover:text-red-600">{tp.cancel || "Clear"}</button>
                </div>
                <input type="text" value={userPrompt} onChange={(e) => setUserPrompt(e.target.value)} placeholder="Describe what to keep (e.g. only the text, just the person...)" className="mt-3 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
              </div>
            )}

            {mode === "auto" && preview && <div><p className="mb-2 text-sm font-medium text-zinc-500">{tp.original || "Original"}</p><img src={preview} alt="Original" className="max-h-[380px] rounded-xl border"/></div>}

            <div className="flex gap-3">
              <button onClick={handleUploadClick} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{t.button || "Remove Background"} ({CREDIT_COST} {t.cost || "credits"})</button>
              <button onClick={reset} className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">{tp.cancel || "Cancel"}</button>
            </div>
          </div>
        )}
      </div>

      <CreditConfirmDialog isOpen={showConfirm} creditsNeeded={CREDIT_COST} currentCredits={user?.credits||0} toolName={t.title || TOOL_ID} locale={locale} onConfirm={handleUpload} onCancel={()=>setShowConfirm(false)}/>
      {showToast && <CreditsUsedToast creditsUsed={creditsUsed} remaining={user?.credits||0} onClose={()=>setShowToast(false)}/>}
    </div>
  );
}
