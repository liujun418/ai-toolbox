"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { toolsApi } from "@/lib/api";
import { useUsageTracker } from "@/hooks/useUsageTracker";
import { getLocaleFromPathname } from "@/lib/locale";
import { CreditConfirmDialog, CreditsUsedToast } from "@/components/CreditGuard";

const TOOL_ID = "background-remover";
const TOOL_NAME = "Background Remover";
const CREDIT_COST = 2;
const BRUSH_SIZES = [20, 40, 60];

type Mode = "auto" | "manual";

export default function BackgroundRemoverPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
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
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const drawingRef = useRef(false);

  useUsageTracker({ toolId: "background-remover", toolName: TOOL_NAME, icon: "✂️", creditsUsed, trigger: creditsUsed > 0 });

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-16 text-center text-zinc-400">Loading...</div>;
  if (!user) { router.push(`/${locale}/login`); return null; }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStatus(mode === "manual" ? "marking" : "idle");
    setResultUrl(null);
    setErrorMsg("");
  }

  const initCanvas = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const w = img.naturalWidth, h = img.naturalHeight;
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (ctx) { ctx.clearRect(0, 0, w, h); }
  }, []);

  function getCanvasPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width, sy = canvas.height / rect.height;
    if ("touches" in e) return { x: (e.touches[0].clientX - rect.left) * sx, y: (e.touches[0].clientY - rect.top) * sy };
    return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) { e.preventDefault(); drawingRef.current = true; draw(e); }
  function stopDraw() { drawingRef.current = false; }
  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!drawingRef.current) return; e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d"); if (!ctx) return;
    const pos = getCanvasPos(e);
    ctx.fillStyle = "rgba(0, 220, 80, 0.7)";
    ctx.strokeStyle = "rgba(0, 220, 80, 0.7)";
    ctx.lineWidth = brushSize; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2); ctx.fill();
  }
  function clearMark() {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
  }

  function getKeepMask(): Blob | null {
    const canvas = canvasRef.current; if (!canvas) return null;
    // Convert green overlay to binary mask (white=keep, black=remove)
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = canvas.width; maskCanvas.height = canvas.height;
    const mCtx = maskCanvas.getContext("2d"); if (!mCtx) return null;
    const imageData = canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height);
    const maskData = mCtx.createImageData(canvas.width, canvas.height);
    let hasPainted = false;
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] > 0) {
        maskData.data[i] = maskData.data[i+1] = maskData.data[i+2] = 255;
        maskData.data[i+3] = 255;
        hasPainted = true;
      }
    }
    if (!hasPainted) return null;
    mCtx.putImageData(maskData, 0, 0);
    const dataUrl = maskCanvas.toDataURL("image/png");
    const binaryStr = atob(dataUrl.split(",")[1]);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
    const blob = new Blob([bytes], { type: "image/png" });
    return blob.size > 0 ? blob : null;
  }

  function handleUploadClick() { if (!file) return; setShowConfirm(true); }

  async function handleUpload() {
    if (!file) return;
    setShowConfirm(false);
    setStatus("uploading");
    setErrorMsg("");
    try {
      const keepMask = mode === "manual" ? getKeepMask() : null;
      const data = await toolsApi.uploadFile(TOOL_ID, file, undefined, keepMask || undefined);
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

  function reset() { setPreview(null); setFile(null); setResultUrl(null); setStatus("idle"); setErrorMsg(""); }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link><span>/</span><span>{TOOL_NAME}</span>
          <Link href={`/${locale}`} className="ml-auto text-xs text-blue-600 hover:text-blue-500">← Back to Tools</Link>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">✂️ {TOOL_NAME}</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Remove image backgrounds instantly with AI. Costs <span className="font-semibold text-blue-600">{CREDIT_COST} credits</span>.</p>
        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-950/20">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">📋 How to Use</p>
          <ol className="mt-2 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
            <li>1. Upload an image — <strong>PNG, JPG, WebP</strong> (max 5MB)</li>
            <li>2. <strong>Auto</strong>: AI detects subject · <strong>Manual</strong>: Paint the area to keep</li>
            <li>3. Click <strong>Remove Background</strong> — processing ~3-5s</li>
            <li>4. Download transparent PNG</li>
          </ol>
          <p className="mt-3 text-xs text-zinc-500">💡 For complex images, use <strong>Manual</strong> to specify exactly what to keep. Paint over the subject with green brush.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {!preview ? (
          <div onClick={() => fileRef.current?.click()} className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 py-16 dark:border-zinc-700">
            <svg className="h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>
            <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">Click to upload an image</p>
            <p className="mt-1 text-xs text-zinc-400">PNG, JPG, WebP — max 5MB</p>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden"/>
          </div>
        ) : status === "done" && resultUrl ? (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div><p className="mb-2 text-sm font-medium text-zinc-500">Original</p><img src={preview} alt="Original" className="w-full rounded-xl object-contain border"/></div>
              <div><p className="mb-2 text-sm font-medium text-zinc-500">Result</p><img src={resultUrl} alt="Result" className="w-full rounded-xl object-contain border bg-[image:url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2020%2020%22%3E%3Crect%20width=%2220%22%20height=%2220%22%20fill=%22%23ccc%22/%3E%3C/svg%3E')]"/></div>
            </div>
            <div className="flex gap-3"><a href={resultUrl} download target="_blank" rel="noopener noreferrer" className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">Download Result</a><button onClick={reset} className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">Try Another</button></div>
          </div>
        ) : status === "uploading" ? (
          <div className="py-16 text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"/><p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">Removing background...</p></div>
        ) : status === "error" ? (
          <div className="py-8 text-center"><p className="mb-4 text-sm text-red-500">{errorMsg}</p><div className="flex justify-center gap-3"><button onClick={handleUploadClick} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Try Again</button><button onClick={reset} className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">Cancel</button></div></div>
        ) : (
          <div className="space-y-6">
            {/* Mode toggle */}
            <div className="flex gap-2">
              <button onClick={() => { setMode("auto"); setStatus("idle"); clearMark(); }} className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${mode === "auto" ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-300" : "border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"}`}>🤖 Auto Detect</button>
              <button onClick={() => { setMode("manual"); setStatus("marking"); }} className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${mode === "manual" ? "border-green-600 bg-green-50 text-green-700 dark:border-green-500 dark:bg-green-900/20 dark:text-green-300" : "border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"}`}>✋ Manual Keep</button>
            </div>

            {mode === "manual" && (
              <div>
                <p className="mb-2 text-sm font-medium text-zinc-500">Paint the area to <strong className="text-green-600">KEEP</strong> — brush: {brushSize}px</p>
                <div className="relative inline-block max-w-full" style={{ lineHeight: 0 }}>
                  <img ref={imgRef} src={preview!} alt="Mark keep area" className="max-h-[380px] max-w-full rounded-xl border" onLoad={initCanvas}/>
                  <canvas ref={canvasRef} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw} onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw} className="absolute inset-0 cursor-crosshair rounded-xl" style={{ touchAction: "none", width: "100%", height: "100%" }}/>
                </div>
                <div className="mt-3 flex gap-2">
                  {BRUSH_SIZES.map(s => <button key={s} onClick={() => setBrushSize(s)} className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${brushSize===s?"border-green-600 bg-green-50 text-green-700 dark:border-green-500 dark:bg-green-900/20 dark:text-green-300":"border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"}`}>{s}px</button>)}
                  <button onClick={clearMark} className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-500 hover:border-red-300 hover:text-red-600 dark:border-zinc-700 dark:text-zinc-400">Clear</button>
                </div>
              </div>
            )}

            {mode === "auto" && preview && <div><p className="mb-2 text-sm font-medium text-zinc-500">Original</p><img src={preview} alt="Original" className="max-h-[380px] rounded-xl border"/></div>}

            <div className="flex gap-3">
              <button onClick={handleUploadClick} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Remove Background ({CREDIT_COST} credits)</button>
              <button onClick={reset} className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">Cancel</button>
            </div>
          </div>
        )}
      </div>

      <CreditConfirmDialog isOpen={showConfirm} creditsNeeded={CREDIT_COST} currentCredits={user?.credits || 0} toolName={TOOL_NAME} locale={locale} onConfirm={handleUpload} onCancel={() => setShowConfirm(false)}/>
      {showToast && <CreditsUsedToast creditsUsed={creditsUsed} remaining={user?.credits || 0} onClose={() => setShowToast(false)}/>}
    </div>
  );
}
