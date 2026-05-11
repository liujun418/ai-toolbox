"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { toolsApi } from "@/lib/api";
import { useUsageTracker } from "@/hooks/useUsageTracker";
import Link from "next/link";
import { getLocaleFromPathname } from "@/lib/locale";

const BRUSH_SIZES = [20, 40, 70];

export default function WatermarkRemoverPage() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [status, setStatus] = useState<"idle" | "marking" | "uploading" | "done" | "error">("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [brushSize, setBrushSize] = useState(40);
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const drawingRef = useRef(false);

  useUsageTracker({
    toolId: "watermark-remover",
    toolName: "Watermark Remover",
    icon: "🧹",
    creditsUsed,
    trigger: creditsUsed > 0,
  });

  if (!user) {
    router.push(`/${locale}/login`);
    return null;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStatus("marking");
    setResultUrl(null);
    setErrorMsg("");
  }

  // Init canvas when image loads
  const initCanvas = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    setImgSize({ w, h });
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.fillRect(0, 0, w, h);
    }
  }, []);

  function getCanvasPos(e: React.MouseEvent | React.TouchEvent): { x: number; y: number } {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    drawingRef.current = true;
    draw(e);
  }

  function stopDraw() {
    drawingRef.current = false;
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!drawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pos = getCanvasPos(e);
    ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
    ctx.strokeStyle = "rgba(255, 255, 0, 0.5)";
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  function clearMask() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  async function getMaskBlob(): Promise<Blob | null> {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    // Create white mask from yellow overlay: non-transparent pixels = watermark area
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const mCtx = maskCanvas.getContext("2d");
    if (!mCtx) return null;
    const imageData = canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height);
    const maskData = mCtx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      // If pixel has any yellow overlay (alpha > 0), make mask white
      if (imageData.data[i + 3] > 0) {
        maskData.data[i] = 255;
        maskData.data[i + 1] = 255;
        maskData.data[i + 2] = 255;
        maskData.data[i + 3] = 255;
      } else {
        maskData.data[i] = 0;
        maskData.data[i + 1] = 0;
        maskData.data[i + 2] = 0;
        maskData.data[i + 3] = 255;
      }
    }
    mCtx.putImageData(maskData, 0, 0);
    return new Promise<Blob | null>((resolve) => {
      maskCanvas.toBlob((blob) => resolve(blob), "image/png");
    });
  }

  async function handleRemove() {
    if (!file) return;
    setStatus("uploading");
    setErrorMsg("");

    const maskBlob = await getMaskBlob();

    try {
      const data = await toolsApi.uploadFile("watermark-remover", file, undefined, maskBlob || undefined);
      setStatus("done");
      setResultUrl(data.output_file_url);
      setCreditsUsed(data.credits_used || 3);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
    }
  }

  function reset() {
    setPreview(null); setFile(null); setResultUrl(null);
    setStatus("idle"); setErrorMsg(""); setImgSize({ w: 0, h: 0 });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <span>Watermark Remover</span>
          <Link href={`/${locale}`} className="ml-auto text-xs text-blue-600 hover:text-blue-500 transition-colors">
            ← Back to Tools
          </Link>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          🧹 Watermark Remover
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Paint over watermarks, logos, or text — AI will remove only the marked areas. Costs <span className="font-semibold text-blue-600">3 credits</span>.
        </p>

        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-950/20">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">📋 How to Use</p>
          <ol className="mt-2 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
            <li>1. Upload an image — <strong>PNG, JPG, WebP</strong> (max 5MB)</li>
            <li>2. <strong>Paint</strong> over the watermark area with the brush</li>
            <li>3. Click <strong>Remove Watermark</strong> — AI regenerates only the painted area</li>
            <li>4. Download the result with watermark removed</li>
          </ol>
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-500">
            💡 The more <strong>precisely</strong> you mark the watermark, the better the result. Image outside the painted area stays completely unchanged.
          </p>
        </div>
      </div>

      {/* Upload / Canvas Area */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {!preview ? (
          <div onClick={() => fileRef.current?.click()} className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 py-16 dark:border-zinc-700">
            <svg className="h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">Upload an image with watermark</p>
            <p className="mt-1 text-xs text-zinc-400">PNG, JPG, WebP — max 5MB</p>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Before/After + Marking */}
            {status === "done" && resultUrl ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">Original</p>
                    <img src={preview} alt="Original" className="w-full rounded-xl object-contain border" />
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">Result</p>
                    <img src={resultUrl} alt="Result" className="w-full rounded-xl object-contain border" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <a href={resultUrl} download target="_blank" rel="noopener noreferrer" className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
                    Download Result
                  </a>
                  <button onClick={reset} className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">
                    Try Another Image
                  </button>
                </div>
              </>
            ) : status === "uploading" ? (
              <div className="py-16 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">AI is removing the watermark...</p>
                <p className="mt-1 text-xs text-zinc-400">This takes ~10–30 seconds</p>
              </div>
            ) : status === "error" ? (
              <div className="py-8 text-center">
                <p className="text-sm text-red-500 mb-4">{errorMsg}</p>
                <div className="flex justify-center gap-3">
                  <button onClick={handleRemove} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Try Again</button>
                  <button onClick={reset} className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">Cancel</button>
                </div>
              </div>
            ) : (
              /* Marking mode */
              <>
                <div className="relative">
                  <p className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Paint over the watermark — brush: {brushSize}px
                  </p>
                  <div className="relative block max-w-full" style={{ lineHeight: 0 }}>
                    <img ref={imgRef} src={preview} alt="Mark watermark" className="max-h-[400px] max-w-full rounded-xl border" onLoad={initCanvas} />
                    <canvas ref={canvasRef} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw} onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw} className="absolute inset-0 cursor-crosshair rounded-xl" style={{ touchAction: "none", width: "100%", height: "100%" }} />
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">The yellow overlay marks areas to be removed by AI</p>
                </div>

                {/* Brush controls */}
                <div className="flex flex-wrap items-center gap-4">
                  {BRUSH_SIZES.map((s) => (
                    <button key={s} onClick={() => setBrushSize(s)} className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${brushSize === s ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-300" : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"}`}>
                      {s}px
                    </button>
                  ))}
                  <button onClick={clearMask} className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:border-red-300 hover:text-red-600 dark:border-zinc-700 dark:text-zinc-400">
                    Clear Marks
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button onClick={handleRemove} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                    Remove Watermark (3 credits)
                  </button>
                  <button onClick={() => { setPreview(null); setFile(null); setStatus("idle"); }} className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
