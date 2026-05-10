"use client";

import { useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { toolsApi } from "@/lib/api";
import { useUsageTracker } from "@/hooks/useUsageTracker";
import { getLocaleFromPathname } from "@/lib/locale";

export default function BackgroundRemoverPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "done" | "error">("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [creditsUsed, setCreditsUsed] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useUsageTracker({
    toolId: "background-remover",
    toolName: "Background Remover",
    icon: "✂️",
    creditsUsed,
    trigger: creditsUsed > 0,
  });

  // Redirect if not logged in
  if (loading) return <div className="mx-auto max-w-4xl px-4 py-16 text-center text-zinc-400">Loading...</div>;
  if (!user) {
    router.push(`/${locale}/login`);
    return null;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStatus("idle");
    setResultUrl(null);
    setErrorMsg("");
  }

  async function handleUpload() {
    if (!file) return;
    setStatus("uploading");
    setErrorMsg("");

    try {
      const data = await toolsApi.uploadFile("background-remover", file);
      setStatus("done");
      setResultUrl(data.output_file_url);
      setCreditsUsed(data.credits_used || 2);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          ✂️ Background Remover
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Remove image backgrounds instantly with AI. Costs <span className="font-semibold text-blue-600">2 credits</span>.
        </p>
      </div>

      {/* Upload Area */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {!preview ? (
          <div
            onClick={() => fileRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 py-16 dark:border-zinc-700"
          >
            <svg className="h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">Click to upload an image</p>
            <p className="mt-1 text-xs text-zinc-400">PNG, JPG, WebP — max 10MB</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Original */}
            <div>
              <p className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">Original</p>
              <img src={preview} alt="Original" className="w-full rounded-xl object-contain" />
            </div>
            {/* Result or placeholder */}
            <div>
              <p className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">Result</p>
              <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
                {status === "done" && resultUrl ? (
                  <img src={resultUrl} alt="Result" className="w-full rounded-xl object-contain" />
                ) : status === "uploading" || status === "processing" ? (
                  <div className="text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                    <p className="mt-2 text-sm text-zinc-500">Processing...</p>
                  </div>
                ) : status === "error" ? (
                  <p className="text-sm text-red-500">{errorMsg}</p>
                ) : (
                  <p className="text-sm text-zinc-400">Upload to see result</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {preview && status === "idle" && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleUpload}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Remove Background (2 credits)
            </button>
            <button
              onClick={() => { setPreview(null); setFile(null); }}
              className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Download */}
        {status === "done" && resultUrl && (
          <div className="mt-6 flex gap-3">
            <a
              href={resultUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
            >
              Download Result
            </a>
            <button
              onClick={() => { setPreview(null); setFile(null); setResultUrl(null); setStatus("idle"); }}
              className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
            >
              Start Over
            </button>
          </div>
        )}

        {/* Error retry */}
        {status === "error" && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleUpload}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Try Again
            </button>
            <button
              onClick={() => { setPreview(null); setFile(null); setErrorMsg(""); setStatus("idle"); }}
              className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
