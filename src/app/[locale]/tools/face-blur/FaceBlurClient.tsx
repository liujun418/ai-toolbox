"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useAuth } from "@/lib/auth-context";
import { CreditConfirmDialog, CreditsUsedToast, LoginPromptDialog } from "@/components/CreditGuard";
import { getCreditCost } from "@/lib/creditCosts";
import { toolsApi, authApi } from "@/lib/api";
import { validateImageFile } from "@/lib/fileValidation";
import type { Locale } from "@/lib/i18n";

const TOOL_ID = "face-blur";

const BLUR_STYLES = [
  { id: "mosaic", label: "Mosaic", icon: "🔲" },
  { id: "gaussian", label: "Gaussian", icon: "🌫️" },
  { id: "pixelate", label: "Pixelate", icon: "🧊" },
  { id: "emoji", label: "Cute Icon", icon: "😊" },
];

const EMOJI_ICONS = [
  { id: "smile", icon: "😊" },
  { id: "mask", icon: "😷" },
  { id: "cat", icon: "🐱" },
  { id: "dog", icon: "🐶" },
  { id: "bear", icon: "🐻" },
  { id: "star", icon: "⭐" },
];

type FaceRegion = { x: number; y: number; w: number; h: number };
type Step = "upload" | "detecting" | "detected" | "processing" | "result";

export default function FaceBlurClient({ locale = "en" as Locale, dict }: { locale?: Locale; dict?: Record<string, unknown> }) {
  const { user, loading, updateUser } = useAuth();
  const t = ((dict as any)?.tools?.[TOOL_ID] as Record<string, string>) || {};
  const tp = (dict as any)?.toolPage || {};

  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [detectedFaces, setDetectedFaces] = useState<FaceRegion[]>([]);
  const [manualRegions, setManualRegions] = useState<FaceRegion[]>([]);
  const [blurStyle, setBlurStyle] = useState("mosaic");
  const [emojiType, setEmojiType] = useState("smile");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"before" | "after">("after");
  const [errorMsg, setErrorMsg] = useState("");
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [detectError, setDetectError] = useState("");

  // Drawing state
  const [drawing, setDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState({ x: 0, y: 0 });
  const [drawRect, setDrawRect] = useState<FaceRegion | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ── Canvas overlay for detected + manual regions ──
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !file) return;
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

    const drawRegion = (r: FaceRegion, stroke: string, fill: string) => {
      const rx = (r.x / img.naturalWidth) * rect.width;
      const ry = (r.y / img.naturalHeight) * rect.height;
      const rw = (r.w / img.naturalWidth) * rect.width;
      const rh = (r.h / img.naturalHeight) * rect.height;
      ctx.fillStyle = fill;
      ctx.fillRect(rx, ry, rw, rh);
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2;
      ctx.strokeRect(rx, ry, rw, rh);
    };

    // Detected faces: green
    for (const r of detectedFaces) {
      drawRegion(r, "#22c55e", "rgba(34,197,94,0.15)");
    }
    // Manual regions: blue
    for (const r of manualRegions) {
      drawRegion(r, "#3b82f6", "rgba(59,130,246,0.15)");
    }
    // Drawing in progress: red
    if (drawing && drawRect) {
      drawRegion(drawRect, "#ef4444", "rgba(239,68,68,0.15)");
    }
  }, [detectedFaces, manualRegions, drawing, drawRect, file]);

  if (loading) return null;

  // ── Coordinate helpers ──
  const getImageCoords = (clientX: number, clientY: number) => {
    if (!imgRef.current) return null;
    const rect = imgRef.current.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) return null;
    return { x, y };
  };

  // ── File handling ──
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateImageFile(f);
    if (err) { setFileError(err); return; }
    setFileError(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStep("upload");
    setDetectedFaces([]);
    setManualRegions([]);
    setResultUrl(null);
    setErrorMsg("");
    setDetectError("");
  }, []);

  // ── Face detection ──
  const handleDetectFaces = async () => {
    if (!file) return;
    setStep("detecting");
    setDetectError("");
    try {
      const result = await toolsApi.detectFaces(file);
      setDetectedFaces(result.faces);
      setStep("detected");
    } catch (err: any) {
      setDetectError(err.message || "Face detection failed");
      setStep("upload");
    }
  };

  // ── Apply blur ──
  const handleApplyBlurClick = () => {
    if (!user) { setShowConfirm(true); return; }
    const cost = getCreditCost(TOOL_ID);
    if (user.credits < cost) { setShowConfirm(true); return; }
    setShowConfirm(true);
  };

  const doApplyBlur = async () => {
    if (!file) return;
    setShowConfirm(false);
    setStep("processing");
    setErrorMsg("");

    try {
      const stylePrompt = blurStyle === "emoji" ? `emoji|${emojiType}` : blurStyle;
      const maskBlob = new Blob(
        [JSON.stringify({ auto_regions: detectedFaces, manual_regions: manualRegions })],
        { type: "application/json" }
      );

      const data = await toolsApi.uploadFile(TOOL_ID, file, stylePrompt, maskBlob);

      if (!data.output_file_url) {
        setStep("detected");
        setErrorMsg(data.error_message || "Processing failed. Please try again.");
        return;
      }

      setResultUrl(data.output_file_url);
      setCreditsUsed(data.credits_used || getCreditCost(TOOL_ID));
      setPreviewMode("after");
      setStep("result");

      updateUser((prev: any) => ({ credits: prev.credits - (data.credits_used || getCreditCost(TOOL_ID)) }));
      authApi.me().then((u: any) => updateUser(u)).catch(() => {});
      setShowToast(true);
    } catch (err: any) {
      setStep("detected");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  // ── Drawing handlers ──
  const handlePointerDown = (e: React.PointerEvent) => {
    if (step !== "detected") return;
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
    setManualRegions((prev) => [...prev, {
      x: Math.round(drawRect.x * img.naturalWidth),
      y: Math.round(drawRect.y * img.naturalHeight),
      w: Math.round(drawRect.w * img.naturalWidth),
      h: Math.round(drawRect.h * img.naturalHeight),
    }]);
    setDrawRect(null);
  };

  const undoLast = () => setManualRegions((prev) => prev.slice(0, -1));

  // ── Reset ──
  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setStep("upload");
    setDetectedFaces([]);
    setManualRegions([]);
    setBlurStyle("mosaic");
    setEmojiType("smile");
    setResultUrl(null);
    setPreviewMode("after");
    setErrorMsg("");
    setDetectError("");
    setFileError(null);
    setShowToast(false);
    setCreditsUsed(0);
    if (fileRef.current) fileRef.current.value = "";
  };

  const totalRegions = detectedFaces.length + manualRegions.length;
  const canDraw = step === "detected";
  const isProcessing = step === "detecting" || step === "processing";

  return (
    <ToolLayout toolId={TOOL_ID} locale={locale} dict={dict}>
      <CreditConfirmDialog
        isOpen={!!user && showConfirm && !fileError}
        toolName={t.name || "Face Privacy Blur"}
        creditsNeeded={getCreditCost(TOOL_ID)}
        currentCredits={user?.credits ?? 0}
        locale={locale}
        dict={dict}
        onConfirm={doApplyBlur}
        onCancel={() => setShowConfirm(false)}
      />
      <LoginPromptDialog isOpen={!user && showConfirm} locale={locale} dict={dict} />
      {showToast && (
        <CreditsUsedToast creditsUsed={creditsUsed} remaining={user?.credits ?? 0} dict={dict} onClose={() => setShowToast(false)} />
      )}

      <div className="space-y-5">
        {/* ── Upload area ── */}
        {!file ? (
          <div
            onClick={() => fileRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 py-20 transition-colors hover:border-blue-400 hover:bg-blue-50/30 dark:border-zinc-700 dark:hover:border-blue-500 dark:hover:bg-blue-900/10"
          >
            <span className="text-5xl">😷</span>
            <p className="mt-4 text-lg font-semibold text-zinc-700 dark:text-zinc-200">{t.uploadTitle || "Upload a photo with faces"}</p>
            <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">JPG, PNG, WebP — {t.maxSize || "up to 10MB"}</p>
          </div>
        ) : (
          <>
            {/* ── Image preview with canvas overlay ── */}
            <div>
              <div ref={containerRef} className="relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
                {/* Step indicators */}
                {step === "detected" && totalRegions > 0 && (
                  <div className="absolute left-3 top-3 z-20 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300">
                    {t.facesFound?.replace("{n}", String(totalRegions)) || `${totalRegions} region(s) marked`}
                  </div>
                )}

                {/* Before/After toggle (result mode) */}
                {step === "result" && (
                  <div className="absolute left-3 top-3 z-20 flex rounded-lg border border-zinc-200 bg-white/90 shadow-sm backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/90">
                    <button onClick={() => setPreviewMode("before")} className={`rounded-l-lg px-3 py-1.5 text-xs font-medium ${previewMode === "before" ? "bg-blue-600 text-white" : "text-zinc-600 dark:text-zinc-400"}`}>
                      {t.before || "Before"}
                    </button>
                    <button onClick={() => setPreviewMode("after")} className={`rounded-r-lg px-3 py-1.5 text-xs font-medium ${previewMode === "after" ? "bg-blue-600 text-white" : "text-zinc-600 dark:text-zinc-400"}`}>
                      {t.after || "After"}
                    </button>
                  </div>
                )}

                <img
                  ref={imgRef}
                  src={(step === "result" && previewMode === "after" && resultUrl) ? resultUrl : (preview || undefined)}
                  alt="Preview"
                  className="w-full object-contain"
                  style={{ maxHeight: "450px", minHeight: "250px" }}
                  draggable={false}
                />

                <canvas
                  ref={canvasRef}
                  className={`absolute inset-0 z-10 ${canDraw ? "cursor-crosshair" : "pointer-events-none"}`}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={() => { setDrawing(false); setDrawRect(null); }}
                />

                {/* Processing overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-sm dark:bg-zinc-950/60">
                    <div className="text-center">
                      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                      <p className="mt-3 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                        {step === "detecting" ? (t.detecting || "Detecting faces...") : (tp.processing || "Processing...")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Step: Upload → Detect Faces button ── */}
            {step === "upload" && (
              <div className="space-y-3">
                <button
                  onClick={handleDetectFaces}
                  className="rounded-xl bg-green-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-green-700 active:scale-95"
                >
                  🤖 {t.detectFaces || "Detect Faces"}
                </button>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  {t.detectHint || "AI will scan the image and locate all faces automatically."}
                </p>
                {detectError && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{detectError}</div>
                )}
              </div>
            )}

            {/* ── Step: Detected → Style + Draw + Apply ── */}
            {step === "detected" && (
              <div className="space-y-4">
                {/* Detection result */}
                {detectedFaces.length === 0 ? (
                  <div className="flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 dark:border-yellow-800 dark:bg-yellow-950/20">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">{t.noFacesFound || "No faces detected"}</p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">{t.noFacesHint || "You can still draw regions manually below."}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 dark:border-green-800 dark:bg-green-950/20">
                    <span className="text-xl">✅</span>
                    <div>
                      <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                        {detectedFaces.length === 1
                          ? (t.oneFaceFound || "1 face detected")
                          : (t.multiFacesFound?.replace("{n}", String(detectedFaces.length)) || `${detectedFaces.length} faces detected`)}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        {t.facesMarkedHint || "Faces are marked with green rectangles. Add extra regions if needed, then choose a blur style."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Style selector */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                    {t.chooseStyle || "Choose Blur Style"}
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {BLUR_STYLES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setBlurStyle(s.id)}
                        className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                          blurStyle === s.id
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        }`}
                      >
                        {s.icon} {s.label}
                      </button>
                    ))}
                  </div>

                  {blurStyle === "emoji" && (
                    <div className="mt-2 flex items-center gap-1.5 rounded-xl bg-zinc-50 px-4 py-2 dark:bg-zinc-800/50">
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">{t.pickEmoji || "Pick icon"}:</span>
                      {EMOJI_ICONS.map((e) => (
                        <button
                          key={e.id}
                          onClick={() => setEmojiType(e.id)}
                          className={`rounded-lg p-2 text-xl transition-all ${
                            emojiType === e.id ? "scale-125 bg-white shadow ring-2 ring-blue-400 dark:bg-zinc-700" : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          {e.icon}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Manual region drawing */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                      ✏️ {t.addRegions || "Add Extra Regions (Optional)"}
                    </label>
                    {manualRegions.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400">{manualRegions.length} {t.regionsAdded || "regions"}</span>
                        <button onClick={undoLast} className="rounded-lg px-2.5 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
                          ↩ {t.undo || "Undo"}
                        </button>
                        <button onClick={() => setManualRegions([])} className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">
                          ✕ {t.clearAll || "Clear"}
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    {t.drawHint || "Click and drag on the image above to add extra blur regions."}
                  </p>
                </div>

                {/* Apply Blur button */}
                <button
                  onClick={handleApplyBlurClick}
                  disabled={totalRegions === 0}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                >
                  😷 {t.applyBlur || "Apply Blur"}
                </button>
              </div>
            )}

            {/* ── Step: Result → Download + New Task ── */}
            {step === "result" && (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => window.open(resultUrl!, "_blank")}
                  className="rounded-xl bg-green-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-green-700 active:scale-95"
                >
                  ⬇ {tp.download || "Download"}
                </button>
                <button
                  onClick={reset}
                  className="rounded-xl border border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  🔄 {t.newTask || "New Task"}
                </button>
              </div>
            )}

            {/* ── Clear / reset always available ── */}
            {step !== "result" && (
              <button
                onClick={reset}
                className="rounded-xl border border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                🗑️ {tp.clear || "Clear"}
              </button>
            )}
          </>
        )}

        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />

        {fileError && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{fileError}</div>}
        {errorMsg && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{errorMsg}</div>}
      </div>
    </ToolLayout>
  );
}
