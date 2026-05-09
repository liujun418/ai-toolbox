"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { toolsApi } from "@/lib/api";
import { useUsageTracker } from "@/hooks/useUsageTracker";
import Link from "next/link";

export default function PdfToWordPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [creditsUsed, setCreditsUsed] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useUsageTracker({
    toolId: "pdf-to-word",
    toolName: "PDF to Word",
    icon: "📄",
    creditsUsed,
    trigger: creditsUsed > 0,
  });

  if (!user) {
    router.push("/login");
    return null;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      setErrorMsg("Please upload a PDF file.");
      return;
    }
    setFile(f);
    setStatus("idle");
    setResultUrl(null);
    setErrorMsg("");
  }

  async function handleConvert() {
    if (!file) return;
    setStatus("uploading");
    setErrorMsg("");

    try {
      const data = await toolsApi.uploadFile("pdf-to-word", file);
      setStatus("done");
      setResultUrl(data.output_file_url);
      setCreditsUsed(data.credits_used || 1);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <span>PDF to Word</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          📄 PDF to Word
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Convert PDF documents to editable Word (.docx) files. Costs <span className="font-semibold text-blue-600">1-2 credits</span> depending on page count.
        </p>
      </div>

      {/* Upload Area */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {!resultUrl ? (
          <div className="space-y-6">
            {!file ? (
              <div
                onClick={() => fileRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 py-16 dark:border-zinc-700"
              >
                <svg className="h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">Upload a PDF file</p>
                <p className="mt-1 text-xs text-zinc-400">PDF — max 20MB</p>
                <input ref={fileRef} type="file" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden" />
              </div>
            ) : (
              <>
                {/* File info */}
                <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{file.name}</p>
                      <p className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {status === "idle" && (
                  <div className="flex gap-3">
                    <button
                      onClick={handleConvert}
                      className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Convert to Word (1-2 credits)
                    </button>
                    <button
                      onClick={() => { setFile(null); setErrorMsg(""); }}
                      className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Processing */}
                {status === "uploading" && (
                  <div className="text-center py-8">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                    <p className="mt-3 text-sm text-zinc-500">Converting PDF to Word...</p>
                    <p className="mt-1 text-xs text-zinc-400">This may take a moment for large files</p>
                  </div>
                )}

                {/* Error */}
                {status === "error" && (
                  <div className="flex gap-3">
                    <button
                      onClick={handleConvert}
                      className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => { setFile(null); setErrorMsg(""); setStatus("idle"); }}
                      className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </>
            )}

            {errorMsg && status === "idle" && (
              <p className="text-sm text-red-600">{errorMsg}</p>
            )}
          </div>
        ) : (
          /* Success */
          <div className="text-center py-8">
            <div className="mb-4 text-5xl">✅</div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Conversion Complete!</h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Your Word document is ready for download.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <a
                href={resultUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
              >
                Download .docx
              </a>
              <button
                onClick={() => { setFile(null); setResultUrl(null); setStatus("idle"); }}
                className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
              >
                Convert Another File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
