"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useTool } from "@/hooks/useTool";
import { useAuth } from "@/lib/auth-context";
import CreditGuard from "@/components/CreditGuard";

const TOOL_ID = "face-blur";
const BLUR_STYLES = [
  { id: "mosaic", label: "Mosaic", icon: "🔲" },
  { id: "gaussian", label: "Gaussian", icon: "🌫️" },
  { id: "pixelate", label: "Pixelate", icon: "🧊" },
];

interface ManualRegion {
  x: number; y: number; w: number; h: number;
  // ratio coordinates (0-1) for backend
  rx: number; ry: number; rw: number; rh: number;
}

export default function FaceBlurClient({ locale, dict }: { locale?: string; dict?: Record<string, unknown> }) {
  const t = ((dict as any)?.tools?.[TOOL_ID] as Record<string, string>) || {};
  const tp = (dict as any)?.toolPage || {};
  const tool = useTool(TOOL_ID, undefined, undefined, undefined, async (file, prompt) => {
    const form = new FormData();
    form.append("file", file);
    if (blurStyle) form.append("prompt", blurStyle);
    if (manualRegions.length > 0) {
      const manualData = manualRegions.map((r) => ({ x: r.rx, y: r.ry, w: r.rw, h: r.rh }));
      form.append("mask", new Blob([JSON.stringify(manualData)], { type: "application/json" }), "regions.json");
    }
    return form;
  });

  const { user } = useAuth();
  const [blurStyle, setBlurStyle] = useState("mosaic");
  const [previewMode, setPreviewMode] = useState<"before" | "after">("after");
  const [manualRegions, setManualRegions] = useState<ManualRegion[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState({ x: 0, y: 0 });
  const [drawRect, setDrawRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0, displayW: 0, displayH: 0 });

  // Sync preview with tool state
  useEffect(() => {
    if (tool.resultUrl) setPreviewMode("after");
  }, [tool.resultUrl]);

  // Init canvas for manual drawing
  useEffect(() => {
    if (!imgRef.current || !canvasRef.current || !imgLoaded) return;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const rect = img.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    const offsetX = rect.left - containerRect.left;
    const offsetY = rect.top - containerRect.top;
    canvas.style.left = offsetX + "px";
    canvas.style.top = offsetY + "px";
    canvas.width = rect.width;
    canvas.height = rect.height;
    setImgSize({ w: img.naturalWidth, h: img.naturalHeight, displayW: rect.width, displayH: rect.height });
  }, [imgLoaded, tool.file]);

  const scaleToRatio = (clientX: number, clientY: number) => {
    if (!containerRef.current || !imgRef.current) return { rx: 0, ry: 0 };
    const containerRect = containerRef.current.getBoundingClientRect();
    const imgRect = imgRef.current.getBoundingClientRect();
    const x = clientX - imgRect.left;
    const y = clientY - imgRect.top;
    return {
      rx: Math.max(0, Math.min(1, x / imgRect.width)),
      ry: Math.max(0, Math.min(1, y / imgRect.height)),
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imgLoaded || tool.processing) return;
    const { rx, ry } = scaleToRatio(e.clientX, e.clientY);
    setDrawing(true);
    setDrawStart({ x: e.clientX, y: e.clientY });
    setDrawRect({ x: e.clientX, y: e.clientY, w: 0, h: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawing || !drawRect) return;
    const w = e.clientX - drawStart.x;
    const h = e.clientY - drawStart.y;
    setDrawRect({ x: Math.min(drawStart.x, e.clientX), y: Math.min(drawStart.y, e.clientY), w: Math.abs(w), h: Math.abs(h) });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!drawing || !drawRect || !imgRef.current || !containerRef.current) { setDrawing(false); return; }
    setDrawing(false);
    const containerRect = containerRef.current.getBoundingClientRect();
    const imgRect = imgRef.current.getBoundingClientRect();
    const x1 = (drawRect.x - imgRect.left) / imgRect.width;
    const y1 = (drawRect.y - imgRect.top) / imgRect.height;
    const x2 = (drawRect.x + drawRect.w - imgRect.left) / imgRect.width;
    const y2 = (drawRect.y + drawRect.h - imgRect.top) / imgRect.height;
    const rx = Math.max(0, Math.min(1, Math.min(x1, x2)));
    const ry = Math.max(0, Math.min(1, Math.min(y1, y2)));
    const rw = Math.min(1 - rx, Math.abs(x2 - x1));
    const rh = Math.min(1 - ry, Math.abs(y2 - y1));
    if (rw < 0.01 || rh < 0.01) { setDrawRect(null); return; }
    // Pixel coordinates for display
    const x = Math.round(rx * imgRef.current.naturalWidth);
    const y = Math.round(ry * imgRef.current.naturalHeight);
    const w = Math.round(rw * imgRef.current.naturalWidth);
    const h = Math.round(rh * imgRef.current.naturalHeight);
    setManualRegions((prev) => [...prev, { x, y, w, h, rx, ry, rw, rh }]);
    setDrawRect(null);
  };

  const undoLast = () => setManualRegions((prev) => prev.slice(0, -1));
  const clearRegions = () => setManualRegions([]);

  const currentImage = previewMode === "after" && tool.resultUrl
    ? tool.resultUrl
    : tool.file
    ? URL.createObjectURL(tool.file)
    : null;

  return (
    <ToolLayout toolId={TOOL_ID} locale={locale} dict={dict}>
      <CreditGuard toolId={TOOL_ID} locale={locale} dict={dict}>
        <div className="space-y-6">
          {/* Upload area */}
          {!tool.file ? (
            <div
              onClick={() => document.getElementById("face-blur-input")?.click()}
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
                    disabled={tool.processing}
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
                      <button onClick={clearRegions} className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">
                        ✕ {t.clearAll || "Clear All"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Image preview */}
              <div className="flex flex-col gap-4 lg:flex-row">
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
                    src={currentImage || undefined}
                    alt="Preview"
                    className="w-full object-contain"
                    style={{ maxHeight: "500px", minHeight: "300px" }}
                    onLoad={() => setImgLoaded(true)}
                    draggable={false}
                  />

                  {/* Manual drawing canvas */}
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 cursor-crosshair"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={() => { setDrawing(false); setDrawRect(null); }}
                  />

                  {/* Render existing manual regions */}
                  {imgLoaded && canvasRef.current && manualRegions.map((r, i) => {
                    const ctx = canvasRef.current?.getContext("2d");
                    // Regions are now rendered via canvas overlay
                    return null;
                  })}

                  {/* Processing overlay */}
                  {tool.processing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm dark:bg-zinc-950/60">
                      <div className="text-center">
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                        <p className="mt-3 text-sm font-medium text-zinc-700 dark:text-zinc-200">{tp.processing || "Processing..."}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Draw region indicator */}
              {tool.file && !tool.resultUrl && (
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  ✏️ {t.drawHint || "Click and drag on the image to add manual blur regions. Use AI detection + manual regions for complete coverage."}
                </p>
              )}

              {/* Manual regions list */}
              {manualRegions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {manualRegions.map((r, i) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                      🎯 {t.region || "Region"} {i + 1}
                      <button onClick={() => setManualRegions((prev) => prev.filter((_, j) => j !== i))} className="ml-0.5 text-blue-400 hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {tool.file && !tool.resultUrl && (
                  <button
                    onClick={() => tool.start()}
                    disabled={tool.processing}
                    className="rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                  >
                    😷 {t.process || "Apply Face Blur"} — {tool.cost} {tp.credits || "credits"}
                  </button>
                )}

                {tool.resultUrl && (
                  <>
                    <button
                      onClick={() => tool.start()}
                      disabled={tool.processing}
                      className="rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                    >
                      🔄 {t.reprocess || "Re-process"} — {tool.cost} {tp.credits || "credits"}
                    </button>
                    <a
                      href={tool.resultUrl}
                      download={`face-blur-${Date.now()}.png`}
                      className="rounded-xl bg-green-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-green-700 active:scale-95"
                    >
                      ⬇ {tp.download || "Download"}
                    </a>
                  </>
                )}

                <button
                  onClick={() => { tool.reset(); setManualRegions([]); setImgLoaded(false); }}
                  className="rounded-xl border border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  🗑️ {tp.clear || "Clear"}
                </button>
              </div>
            </>
          )}

          <input
            id="face-blur-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) { tool.uploadFile(f); setManualRegions([]); setImgLoaded(false); }
            }}
          />

          {tool.error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{tool.error}</div>
          )}
        </div>
      </CreditGuard>
    </ToolLayout>
  );
}
