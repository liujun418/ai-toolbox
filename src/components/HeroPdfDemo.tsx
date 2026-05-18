"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function HeroPdfDemo({ locale, dict }: { locale: string; dict?: Record<string, unknown> }) {
  const t = (dict as any)?.heroPdf || {};
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [limited, setLimited] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((f: File) => {
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setErrorMsg("Please select a PDF file.");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setErrorMsg("File too large. Maximum 20MB.");
      return;
    }
    setFile(f);
    setErrorMsg("");
    setStatus("idle");
    setResultUrl(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) processFile(f);
  }, [processFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  }, [processFile]);

  const handleConvert = useCallback(async () => {
    if (!file) return;
    setStatus("uploading");
    setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE}/api/upload/public/pdf-to-word-demo`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Conversion failed" }));
        throw new Error(err.detail || "Conversion failed");
      }
      const data = await res.json();
      setResultUrl(data.output_url);
      setLimited(data.limited);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Conversion failed. Try a different PDF.");
      setStatus("error");
    }
  }, [file]);

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setResultUrl(null);
    setErrorMsg("");
    setLimited(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-blue-900 px-6 py-12 sm:px-12 sm:py-16">
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {t.title || "PDF to Word — Free, No Sign-up"}
        </h1>
        <p className="mt-3 text-lg text-zinc-300">
          {t.subtitle || "Drop a PDF, get an editable Word file. Instant, free, no account needed."}
        </p>

        {!file ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`mt-6 cursor-pointer rounded-xl border-2 border-dashed px-6 py-12 transition-colors ${
              dragging
                ? "border-white bg-white/20"
                : "border-zinc-400 bg-white/5 hover:border-white hover:bg-white/10"
            }`}
          >
            <span className="text-5xl">📄</span>
            <p className="mt-3 text-lg font-semibold text-white">
              {t.dropHere || "Drop your PDF here"}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              {t.orClick || "or click to upload"} — {t.maxSize || "PDF, max 20MB"}
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-xl bg-white/10 p-6 backdrop-blur">
            <p className="text-sm text-zinc-300">
              📄 {file.name} <span className="text-zinc-500">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
            </p>
            {status === "idle" && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={handleConvert}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {t.convert || "Convert to Word"}
                </button>
                <button
                  onClick={reset}
                  className="rounded-lg border border-zinc-500 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/10"
                >
                  {t.tryAnother || "Choose another"}
                </button>
              </div>
            )}
            {status === "uploading" && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="text-sm text-zinc-300">{t.converting || "Converting..."}</span>
              </div>
            )}
            {status === "done" && resultUrl && (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-semibold text-green-400">{t.done || "Your Word file is ready!"}</p>
                {limited && (
                  <p className="text-xs text-amber-300">
                    {t.limitedNotice || "Showing first 3 pages. Sign up for unlimited pages."}
                  </p>
                )}
                <div className="flex items-center justify-center gap-3">
                  <a
                    href={resultUrl}
                    className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    ⬇ {t.download || "Download .docx"}
                  </a>
                  <Link
                    href={`/${locale}/signup`}
                    className="rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
                  >
                    {t.cta || "Get 5 Free Credits"}
                  </Link>
                  <button onClick={reset} className="text-sm text-zinc-400 hover:text-zinc-200">
                    {t.tryAnother || "Convert Another"}
                  </button>
                </div>
              </div>
            )}
            {status === "error" && (
              <div className="mt-4">
                <p className="text-sm text-red-400">{errorMsg}</p>
                <button onClick={reset} className="mt-2 text-sm text-zinc-400 hover:text-zinc-200 underline">
                  Try a different file
                </button>
              </div>
            )}
          </div>
        )}

        {/* Trust badges */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-zinc-400">
          <span>🔒 No account needed</span>
          <span>⚡ Instant conversion</span>
          <span>🗑️ Files auto-deleted</span>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
