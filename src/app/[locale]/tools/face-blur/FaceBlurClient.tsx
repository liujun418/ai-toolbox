"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useAuth } from "@/lib/auth-context";
import { useTool } from "@/hooks/useTool";
import { ToolSkeleton } from "@/components/LoadingSkeleton";
import { CreditConfirmDialog, CreditsUsedToast, LoginPromptDialog } from "@/components/CreditGuard";
import { getCreditCost } from "@/lib/creditCosts";
import type { Locale } from "@/lib/i18n";

const TOOL_ID = "face-blur";
const BLUR_STYLES = [
  { id: "mosaic", label: "Mosaic", icon: "🔲" },
  { id: "gaussian", label: "Gaussian", icon: "🌫️" },
  { id: "pixelate", label: "Pixelate", icon: "🧊" },
];

export default function FaceBlurClient({ locale = "en" as Locale, dict }: { locale?: Locale; dict?: Record<string, unknown> }) {
  const { user, loading } = useAuth();
  const t = ((dict as any)?.tools?.[TOOL_ID] as Record<string, string>) || {};
  const tp = (dict as any)?.toolPage || {};

  const [blurStyle, setBlurStyle] = useState("mosaic");
  const [previewMode, setPreviewMode] = useState<"before" | "after">("after");
  const [manualRegions, setManualRegions] = useState<{ x: number; y: number; w: number; h: number }[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState({ x: 0, y: 0 });
  const [drawRect, setDrawRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const buildPrompt = useCallback(() => blurStyle, [blurStyle]);

  const getMask = useCallback(async (): Promise<Blob | null> => {
    if (manualRegions.length === 0) return null;
    const data = manualRegions.map((r) => {
      const img = imgRef.current;
      if (!img) return { x: r.x, y: r.y, w: r.w, h: r.h };
      return {
        x: Math.round((r.x / img.naturalWidth) * img.naturalWidth),
        y: Math.round((r.y / img.naturalHeight) * img.naturalHeight),
        w: Math.round((r.w / img.naturalWidth) * img.naturalWidth),
        h: Math.round((r.h / img.naturalHeight) * img.naturalHeight),
      };
    });
    return new Blob([JSON.stringify(data)], { type: "application/json" });
  }, [manualRegions]);

  const tool = useTool({
    toolId: TOOL_ID,
    creditCost: getCreditCost(TOOL_ID),
    buildPrompt,
    getMask,
    locale,
    dict,
  });

  // Show after preview when result is ready
  useEffect(() => {
    if (tool.resultUrl) setPreviewMode("after");
  }, [tool.resultUrl]);

  if (loading) return <ToolSkeleton />;

  // Mouse/touch drawing handlers
  const getImageCoords = (clientX: number, clientY: number) => {
    if (!imgRef.current) return null;
    const rect = imgRef.current.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) return null;
    return { x, y };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!tool.file || tool.status === "uploading") return;
    const coords = getImageCoords(e.clientX, e.clientY);
    if (!coords) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDrawing(true);
    setDrawStart(coords);
    setDrawRect({ x: coords.x, y: coords.y, w: 0, h: 0 });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!drawing || !drawRect) return;
    const coords = getImageCoords(e.clientX, e.clientY);
    if (!coords) return;
    setDrawRect({
      x: Math.min(drawStart.x, coords.x),
      y: Math.min(drawStart.y, coords.y),
      w: Math.abs(coords.x - drawStart.x),
      h: Math.abs(coords.y - drawStart.y),
    });
  };

  const handlePointerUp = () => {
    if (!drawing || !drawRect) { setDrawing(false); return; }
    setDrawing(false);
    if (drawRect.w < 0.02 || drawRect.h < 0.02) { setDrawRect(null); return; }
    const img = imgRef.current;
    if (!img) { setDrawRect(null); return; }
    setManualRegions((prev) => [
      ...prev,
      {
        x: Math.round(drawRect.x * img.naturalWidth),
        y: Math.round(drawRect.y * img.naturalHeight),
        w: Math.round(drawRect.w * img.naturalWidth),
        h: Math.round(drawRect.h * img.naturalHeight),
      },
    ]);
    setDrawRect(null);
  };

  const undoLast = () => setManualRegions((prev) => prev.slice(0, -1));

  // Render manual region overlays
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !tool.file) return;
    const rect = img.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    canvas.style.left = (rect.left - containerRect.left) + "px";
    canvas.style.top = (rect.top - containerRect.top) + "px";
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw existing manual regions
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.fillStyle = "rgba(59,130,246,0.15)";
    for (const r of manualRegions) {
      const rx = (r.x / img.naturalWidth) * rect.width;
      const ry = (r.y / img.naturalHeight) * rect.height;
      const rw = (r.w / img.naturalWidth) * rect.width;
      const rh = (r.h / img.naturalHeight) * rect.height;
      ctx.fillRect(rx, ry, rw, rh);
      ctx.strokeRect(rx, ry, rw, rh);
    }

    // Draw in-progress rectangle
    if (drawing && drawRect) {
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.fillStyle = "rgba(239,68,68,0.15)";
      const rx = drawRect.x * rect.width;
      const ry = drawRect.y * rect.height;
      const rw = drawRect.w * rect.width;
      const rh = drawRect.h * rect.height;
      ctx.fillRect(rx, ry, rw, rh);
      ctx.strokeRect(rx, ry, rw, rh);
    }
  }, [manualRegions, drawing, drawRect, tool.file]);

  return (
    <ToolLayout toolId={TOOL_ID} locale={locale} dict={dict}>
      <CreditConfirmDialog
        isOpen={!!user && tool.showConfirm && !tool.fileError}
        toolName={t.name || "Face Privacy Blur"}
        creditsNeeded={getCreditCost(TOOL_ID)}
        currentCredits={user?.credits ?? 0}
        locale={locale}
        dict={dict}
        onConfirm={() => tool.handleUpload({})}
        onCancel={() => tool.setShowConfirm(false)}
      />
      <LoginPromptDialog
        isOpen={!user && tool.showConfirm}
        locale={locale}
        dict={dict}
      />
      <CreditsUsedToast
        isOpen={tool.showToast}
        creditsUsed={tool.creditsUsed}
        remaining={user?.credits ?? 0}
        dict={dict}
        onClose={() => tool.setShowToast(false)}
      />

      <div className="space-y-6">
        {/* Upload area */}
        {!tool.file ? (
          <div
            onClick={() => tool.fileRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 py-20 transition-colors hover:border-blue-400 hover:bg-blue-50/30 dark:border-zinc-700 dark:hover:border-blue-500 dark:hover:bg-blue-900/10"
          >
            <span className="text-5xl">😷</span>
            <p className="mt-4 text-lg font-semibold text-zinc-700 dark:text-zinc-200">{t.uploadTitle || "Upload a photo with faces"}</p>
            <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">JPG, PNG, WebP — {t.maxSize || "up to 10MB"}</p>
          </div>
        ) : (
          <>
            {/* Blur style selector */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{t.style || "Blur Style"}:</span>
              {BLUR_STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setBlurStyle(s.id)}
                  disabled={tool.status === "uploading"}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    blurStyle === s.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  {s.icon} {s.label}
                </button>
              ))}

              <div className="ml-auto flex items-center gap-2">
                {manualRegions.length > 0 && (
                  <>
                    <button onClick={undoLast} className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
                      ↩ {t.undo || "Undo"} ({manualRegions.length})
                    </button>
                    <button onClick={() => setManualRegions([])} className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">
                      ✕ {t.clearAll || "Clear All"}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Image preview */}
            <div ref={containerRef} className="relative flex-1 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
              {/* Before/After toggle */}
              {tool.resultUrl && (
                <div className="absolute left-3 top-3 z-20 flex rounded-lg border border-zinc-200 bg-white/90 shadow-sm backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/90">
                  <button
                    onClick={() => setPreviewMode("before")}
                    className={`rounded-l-lg px-3 py-1.5 text-xs font-medium ${previewMode === "before" ? "bg-blue-600 text-white" : "text-zinc-600 dark:text-zinc-400"}`}
                  >
                    {t.before || "Before"}
                  </button>
                  <button
                    onClick={() => setPreviewMode("after")}
                    className={`rounded-r-lg px-3 py-1.5 text-xs font-medium ${previewMode === "after" ? "bg-blue-600 text-white" : "text-zinc-600 dark:text-zinc-400"}`}
                  >
                    {t.after || "After"}
                  </button>
                </div>
              )}

              <img
                ref={imgRef}
                src={(previewMode === "after" && tool.resultUrl) ? tool.resultUrl : (tool.preview || undefined)}
                alt="Preview"
                className="w-full object-contain"
                style={{ maxHeight: "500px", minHeight: "300px" }}
                draggable={false}
              />

              <canvas
                ref={canvasRef}
                className="absolute inset-0 z-10 cursor-crosshair"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={() => { setDrawing(false); setDrawRect(null); }}
              />

              {/* Processing overlay */}
              {tool.status === "uploading" && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-sm dark:bg-zinc-950/60">
                  <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                    <p className="mt-3 text-sm font-medium text-zinc-700 dark:text-zinc-200">{tp.processing || "Processing..."}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Manual region hint */}
            {!tool.resultUrl && (
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                ✏️ {t.drawHint || "Click and drag on the image to add manual blur regions."}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => tool.handleUploadClick()}
                disabled={tool.status === "uploading"}
                className="rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
              >
                😷 {tool.resultUrl ? (t.reprocess || "Re-process") : (t.process || "Apply Face Blur")}
                {tool.resultUrl ? ` — ${getCreditCost(TOOL_ID)} ${tp.credits || "credits"}` : ""}
              </button>

              {tool.resultUrl && (
                <a
                  href={tool.resultUrl}
                  download={`face-blur-${Date.now()}.png`}
                  className="rounded-xl bg-green-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-green-700 active:scale-95"
                >
                  ⬇ {tp.download || "Download"}
                </a>
              )}

              <button
                onClick={() => { tool.reset(); setManualRegions([]); }}
                className="rounded-xl border border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                🗑️ {tp.clear || "Clear"}
              </button>
            </div>
          </>
        )}

        <input
          ref={tool.fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={tool.handleFileChange}
        />

        {tool.fileError && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{tool.fileError}</div>
        )}
        {tool.errorMsg && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{tool.errorMsg}</div>
        )}
      </div>
    </ToolLayout>
  );
}
