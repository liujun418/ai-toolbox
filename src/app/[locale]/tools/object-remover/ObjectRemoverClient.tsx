"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useAuth } from "@/lib/auth-context";
import { useTool } from "@/hooks/useTool";
import { CreditConfirmDialog, CreditsUsedToast, LoginPromptDialog } from "@/components/CreditGuard";
import { getCreditCost } from "@/lib/creditCosts";
import type { Locale } from "@/lib/i18n";

const TOOL_ID = "object-remover";

export default function ObjectRemoverClient({ locale = "en" as Locale, dict }: { locale?: Locale; dict?: Record<string, unknown> }) {
  const { user, loading } = useAuth();
  const t = ((dict as any)?.tools?.[TOOL_ID] as Record<string, string>) || {};

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasMask, setHasMask] = useState(false);
  const [imgNatural, setImgNatural] = useState<{ w: number; h: number } | null>(null);

  const getMaskBlob = useCallback(async (): Promise<Blob | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    // Create a mask canvas with same dimensions as the natural image
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = imgNatural?.w || canvas.width;
    maskCanvas.height = imgNatural?.h || canvas.height;
    const ctx = maskCanvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    // Scale the drawn mask from display size to natural size
    const scaleX = maskCanvas.width / canvas.width;
    const scaleY = maskCanvas.height / canvas.height;
    ctx.drawImage(canvas, 0, 0, canvas.width * scaleX, canvas.height * scaleY);
    return new Promise((resolve) => {
      maskCanvas.toBlob((b) => resolve(b), "image/png");
    });
  }, [imgNatural]);

  const tool = useTool({
    toolId: TOOL_ID,
    creditCost: getCreditCost(TOOL_ID),
    getMask: getMaskBlob,
    locale,
    dict,
  });

  // Initialize canvas when preview changes
  useEffect(() => {
    if (!tool.preview || !canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      setImgNatural({ w: img.naturalWidth, h: img.naturalHeight });
      // Match container width, maintain aspect ratio
      const containerWidth = containerRef.current!.clientWidth;
      const scale = containerWidth / img.naturalWidth;
      canvas.width = containerWidth;
      canvas.height = img.naturalHeight * scale;
      // Draw image onto canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = tool.preview;
  }, [tool.preview]);

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCanvasPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCanvasPos(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "rgba(255, 0, 0, 0.6)";
    ctx.lineWidth = Math.max(canvasRef.current!.width, canvasRef.current!.height) * 0.04;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    setHasMask(true);
  };

  const stopDraw = () => setIsDrawing(false);

  const clearMask = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !tool.preview) return;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setHasMask(false);
    };
    img.src = tool.preview;
  };

  if (loading) return null;

  return (
    <ToolLayout toolId={TOOL_ID} locale={locale} dict={dict}>
      <CreditConfirmDialog
        isOpen={!!user && tool.showConfirm && !tool.fileError}
        toolName={t.name || "AI Object Remover"}
        creditsNeeded={getCreditCost(TOOL_ID)}
        currentCredits={user?.credits ?? 0}
        locale={locale}
        dict={dict}
        onConfirm={() => tool.handleUpload({})}
        onCancel={() => tool.setShowConfirm(false)}
      />
      <LoginPromptDialog isOpen={!user && tool.showConfirm} locale={locale} dict={dict} />
      {tool.showToast && (
        <CreditsUsedToast creditsUsed={tool.creditsUsed} remaining={user?.credits ?? 0} dict={dict} onClose={() => tool.setShowToast(false)} />
      )}

      <div className="space-y-5">
        {/* Upload */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            {t.uploadLabel || "Upload Photo"}
          </label>
          <input
            ref={tool.fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={tool.handleFileChange}
            className="w-full text-sm text-zinc-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700 dark:text-zinc-400"
          />
          {tool.fileError && <p className="mt-1 text-sm text-red-600">{tool.fileError}</p>}
        </div>

        {/* Canvas mask area */}
        {tool.preview && tool.status !== "done" && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              {t.maskLabel || "Paint over objects to remove"}
            </label>
            <div ref={containerRef} className="relative overflow-hidden rounded-xl border-2 border-red-400 dark:border-red-600">
              <canvas
                ref={canvasRef}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                className="block w-full cursor-crosshair"
              />
            </div>
            <div className="mt-2 flex items-center gap-3">
              <p className="text-xs text-zinc-500">{t.maskHint || "Paint red strokes over unwanted objects, people, or text."}</p>
              {hasMask && (
                <button
                  onClick={clearMask}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  {t.clearMask || "Clear Mask"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Remove button */}
        {tool.preview && tool.status !== "done" && (
          <button
            onClick={() => tool.handleUploadClick()}
            disabled={!hasMask || tool.status === "uploading"}
            className="rounded-xl bg-red-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-red-700 active:scale-95 disabled:opacity-50"
          >
            🧹 {t.button || "Remove Objects (3 credits)"}
          </button>
        )}

        {tool.status === "uploading" && (
          <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-950/20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{t.generating || "Removing objects..."}</span>
          </div>
        )}

        {tool.errorMsg && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300">
            {tool.errorMsg}
          </div>
        )}

        {/* Result */}
        {tool.status === "done" && tool.resultUrl && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              {t.resultLabel || "Result"}
            </label>
            <img
              src={tool.resultUrl}
              alt="Result"
              className="max-h-96 w-full rounded-xl border border-zinc-200 object-contain dark:border-zinc-700"
            />
            <div className="flex items-center gap-3">
              <a
                href={tool.resultUrl}
                download={`cleaned-${Date.now()}.png`}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                ⬇ {t.download || "Download"}
              </a>
              <button
                onClick={tool.reset}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                🔄 {t.tryAnother || "Remove More"}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
