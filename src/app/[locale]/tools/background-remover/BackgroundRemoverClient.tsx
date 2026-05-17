"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useAuth } from "@/lib/auth-context";
import { useTool } from "@/hooks/useTool";
import { ToolSkeleton } from "@/components/LoadingSkeleton";
import { CreditConfirmDialog, CreditsUsedToast, LoginPromptDialog } from "@/components/CreditGuard";
import type { Locale } from "@/lib/i18n";

const TOOL_ID = "background-remover";
const CREDIT_COST = 2;
const BRUSH_SIZES = [20, 40, 60];
const BG_COLORS = ["transparent", "white", "black"] as const;

export default function BackgroundRemoverClient({ locale = "en" as Locale, dict }: { locale?: Locale; dict?: Record<string, unknown> }) {
  const { user, loading } = useAuth();
  const [bgColor, setBgColor] = useState("transparent");
  const [customColor, setCustomColor] = useState("#00ff00");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [brushSize, setBrushSize] = useState(40);
  const [maskPixels, setMaskPixels] = useState(0);
  const [userPrompt, setUserPrompt] = useState("");

  const drawRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const drawingRef = useRef(false);

  const tool = useTool({
    toolId: TOOL_ID,
    creditCost: CREDIT_COST,
    buildPrompt: () => showAdvanced && userPrompt.trim() ? `Keep only: ${userPrompt.trim()}` : undefined,
    getMask: async () => {
      if (!showAdvanced) return null;
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
    },
    getBgColor: ({ bg }) => typeof bg === "string" && bg !== "transparent" ? bg : undefined,
    locale,
    dict,
  });

  const t = (dict as any)?.backgroundRemover || {};
  const tp = (dict as any)?.toolPage || {};

  const originalHandleFileChange = tool.handleFileChange;
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    originalHandleFileChange(e);
    setMaskPixels(0);
    if (drawRef.current) drawRef.current.getContext("2d")?.clearRect(0, 0, drawRef.current.width, drawRef.current.height);
    if (maskRef.current) maskRef.current.getContext("2d")?.clearRect(0, 0, maskRef.current.width, maskRef.current.height);
  }, [originalHandleFileChange]);

  const initCanvas = useCallback(() => {
    const img = imgRef.current, d = drawRef.current, m = maskRef.current;
    if (!img || !d || !m) return;
    d.width = m.width = img.naturalWidth;
    d.height = m.height = img.naturalHeight;
    d.getContext("2d")!.clearRect(0, 0, d.width, d.height);
    m.getContext("2d")!.clearRect(0, 0, m.width, m.height);
    setMaskPixels(0);
  }, []);

  const canvasPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const c = drawRef.current!;
    const r = c.getBoundingClientRect();
    const sx = c.width / r.width, sy = c.height / r.height;
    if ("touches" in e) return { x: (e.touches[0].clientX - r.left) * sx, y: (e.touches[0].clientY - r.top) * sy };
    return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy };
  }, []);

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => { e.preventDefault(); drawingRef.current = true; doDraw(e); }, []);
  const stopDraw = useCallback(() => { drawingRef.current = false; }, []);
  const doDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!drawingRef.current) return; e.preventDefault();
    const ctx = drawRef.current?.getContext("2d"); if (!ctx) return;
    const p = canvasPos(e);
    ctx.fillStyle = "rgba(0,220,80,0.7)"; ctx.lineWidth = brushSize; ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(p.x, p.y, brushSize/2, 0, Math.PI*2); ctx.fill();
  }, [brushSize, canvasPos]);

  const updateMaskCount = useCallback(() => {
    const d = drawRef.current; if (!d) return;
    const data = d.getContext("2d")!.getImageData(0, 0, d.width, d.height);
    let n = 0; for (let i = 3; i < data.data.length; i += 4) if (data.data[i] > 0) n++;
    setMaskPixels(n);
  }, []);

  const handleUpload = () => {
    const colorToSend = bgColor === "custom" ? customColor : bgColor;
    tool.handleUpload({ bg: colorToSend });
  };

  if (loading) return <ToolSkeleton />;

  const showLoginPrompt = !user && tool.showConfirm;

  return (
        <ToolLayout toolId="background-remover" locale={locale as string} dict={dict}>


      {tool.fileError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{tool.fileError}</div>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {/* === Upload state === */}
        {!tool.preview ? (
          <div onClick={() => tool.fileRef.current?.click()} className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 py-16 transition-colors hover:border-blue-400 hover:bg-blue-50/30 dark:border-zinc-700 dark:hover:border-blue-500 dark:hover:bg-blue-900/10">
            <svg className="h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>
            <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">{tp.clickToUpload || "Click to upload"}</p>
            <p className="mt-1 text-xs text-zinc-400">{tp.supportedFormats || "PNG, JPG, WebP — max 10MB"}</p>
            <input ref={tool.fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden"/>
          </div>
        ) : /* === Done state === */
        tool.status === "done" && tool.resultUrl ? (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium text-zinc-500">{tp.original || "Original"}</p>
                <img src={tool.preview} alt="Original" className="w-full rounded-xl border object-contain" />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-zinc-500">{tp.result || "Result"}</p>
                <div className={`w-full rounded-xl border overflow-hidden ${bgColor === "transparent" ? "bg-[image:repeating-conic-gradient(#e5e5e5_0%_25%,transparent_0%_50%)_50%/20px_20px]" : ""}`}>
                  <img src={tool.resultUrl} alt="Result" className="w-full object-contain" />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <a href={tool.resultUrl} download target="_blank" rel="noopener noreferrer"
                className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors">{t.download || "Download PNG"}</a>
              <button onClick={tool.reset}
                className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors">{tp.startOver || "Try Another"}</button>
            </div>
          </div>
        ) : /* === Processing / idle / error state === */
        (
          <div className="space-y-6">
            {/* Preview */}
            <div>
              <p className="mb-2 text-sm font-medium text-zinc-500">{tp.original || "Original"}</p>
              <img src={tool.preview} alt="Original" className="max-h-[380px] rounded-xl border object-contain" />
            </div>

            {/* Processing / error status */}
            {tool.status === "uploading" ? (
              <div className="py-8 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"/>
                <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.processing || "Removing background..."}</p>
              </div>
            ) : tool.status === "error" ? (
              <div className="py-4 text-center">
                <p className="mb-4 text-sm text-red-500">{tool.errorMsg}</p>
                <div className="flex justify-center gap-3">
                  <button onClick={handleUpload} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{tp.tryAgain || "Try Again"}</button>
                  <button onClick={tool.reset} className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">{tp.cancel || "Cancel"}</button>
                </div>
              </div>
            ) : (
              <>
                {/* Background color picker */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">{t.bgColor || "Background Color"}</label>
                  <div className="flex gap-2 flex-wrap">
                    {BG_COLORS.map(c => (
                      <button key={c} onClick={() => setBgColor(c)}
                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                          bgColor === c ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-300" : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                        }`}>
                        {c === "transparent" && <span className="mr-1.5 inline-block h-3 w-3 rounded border bg-[image:repeating-conic-gradient(#ccc_0%_25%,transparent_0%_50%)_50%/6px_6px] align-middle" />}
                        {c === "white" && <span className="mr-1.5 inline-block h-3 w-3 rounded border border-zinc-300 bg-white align-middle" />}
                        {c === "black" && <span className="mr-1.5 inline-block h-3 w-3 rounded bg-black align-middle" />}
                        {t[c] || c.charAt(0).toUpperCase() + c.slice(1)}
                      </button>
                    ))}
                    <button onClick={() => setBgColor("custom")}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                        bgColor === "custom" ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-300" : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                      }`}>
                      <span className="mr-1.5 inline-block h-3 w-3 rounded align-middle" style={{ backgroundColor: customColor }} />{t.custom || "Custom"}
                    </button>
                    {bgColor === "custom" && (
                      <input type="color" value={customColor} onChange={e => setCustomColor(e.target.value)}
                        className="h-10 w-10 cursor-pointer rounded border border-zinc-300 p-0.5" />
                    )}
                  </div>
                </div>

                {/* Advanced: manual paint mode */}
                <div>
                  <button onClick={() => { setShowAdvanced(!showAdvanced); if (showAdvanced) { setMaskPixels(0); if (drawRef.current) drawRef.current.getContext("2d")?.clearRect(0,0,drawRef.current.width,drawRef.current.height); } }}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                      showAdvanced ? "border-green-600 bg-green-50 text-green-700 dark:border-green-500 dark:bg-green-900/20 dark:text-green-300" : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                    }`}>
                    {t.advanced || "Advanced"}: {showAdvanced ? t.manualMode || "Manual Paint" : t.autoMode || "Auto Remove"}
                  </button>

                  {showAdvanced && (
                    <div className="mt-3 space-y-3">
                      <p className="text-sm font-medium text-zinc-500">
                        Paint <strong className="text-green-600">KEEP</strong> area &mdash; brush {brushSize}px
                        {maskPixels > 0 && <span className="text-green-600"> ({maskPixels} px marked)</span>}
                      </p>
                      <div className="relative inline-block max-w-full" style={{ lineHeight: 0 }}>
                        <img ref={imgRef} src={tool.preview!} alt="mark" className="max-h-[380px] max-w-full rounded-xl border" onLoad={initCanvas}/>
                        <canvas ref={drawRef}
                          onMouseDown={startDraw} onMouseMove={doDraw}
                          onMouseUp={(e) => { stopDraw(); updateMaskCount(); }} onMouseLeave={stopDraw}
                          onTouchStart={startDraw} onTouchMove={doDraw}
                          onTouchEnd={(e) => { stopDraw(); updateMaskCount(); }}
                          className="absolute inset-0 cursor-crosshair rounded-xl" style={{ touchAction: "none", width: "100%", height: "100%" }}/>
                      </div>
                      <canvas ref={maskRef} className="hidden"/>
                      <div className="flex gap-2">
                        {BRUSH_SIZES.map(s => <button key={s} onClick={() => setBrushSize(s)}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${brushSize===s?"border-green-600 bg-green-50 text-green-700 dark:border-green-500 dark:bg-green-900/20 dark:text-green-300":"border-zinc-200 text-zinc-600"}`}>{s}px</button>)}
                        <button onClick={() => { drawRef.current?.getContext("2d")?.clearRect(0,0,drawRef.current.width,drawRef.current.height); setMaskPixels(0); }}
                          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-500 hover:border-red-300 hover:text-red-600">{tp.cancel || "Clear"}</button>
                      </div>
                      <input type="text" value={userPrompt} onChange={(e) => setUserPrompt(e.target.value)}
                        placeholder={t.promptPlaceholder || "Describe what to keep (e.g. only the person, just the text...)"}
                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button onClick={handleUpload}
                    className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                    {t.button || `Remove Background (${CREDIT_COST} credits)`}
                  </button>
                  <button onClick={tool.reset}
                    className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors">{tp.cancel || "Cancel"}</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <CreditConfirmDialog isOpen={!!user && tool.showConfirm} creditsNeeded={CREDIT_COST} currentCredits={user?.credits||0} toolName={t.title || TOOL_ID} locale={locale} dict={dict} onConfirm={handleUpload} onCancel={()=>tool.setShowConfirm(false)}/>
      <LoginPromptDialog isOpen={showLoginPrompt} locale={locale} dict={dict} />
      {tool.showToast && <CreditsUsedToast creditsUsed={tool.creditsUsed} remaining={user?.credits ?? 0} onClose={()=>tool.setShowToast(false)} dict={dict}/>}
        </ToolLayout>

  );
}
