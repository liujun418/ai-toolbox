"use client";

import { useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { toolsApi } from "@/lib/api";
import { useUsageTracker } from "@/hooks/useUsageTracker";
import Link from "next/link";
import { getLocaleFromPathname } from "@/lib/locale";
import { CreditConfirmDialog, CreditsUsedToast } from "@/components/CreditGuard";

const styles = [
  { id: "cartoon", label: "Cartoon", icon: "🎨" },
  { id: "anime", label: "Anime", icon: "🌸" },
  { id: "professional", label: "Professional", icon: "💼" },
  { id: "pixel-art", label: "Pixel Art", icon: "👾" },
  { id: "watercolor", label: "Watercolor", icon: "🖌️" },
  { id: "oil-painting", label: "Oil Painting", icon: "🖼️" },
];

const TOOL_ID = "avatar-generator";
const TOOL_NAME = "AI Avatar Generator";
const CREDIT_COST = 5;

export default function AvatarGeneratorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("cartoon");
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [creditsUsed, setCreditsUsed] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
const [showConfirm, setShowConfirm] = useState(false);
const [showToast, setShowToast] = useState(false);

  useUsageTracker({
    toolId: "avatar-generator",
    toolName: "AI Avatar Generator",
    icon: "🎨",
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
    setStatus("idle");
    setResultUrl(null);
    setErrorMsg("");
  }

  function handleUploadClick() {
    if (!file) return;
    setShowConfirm(true);
  }

  async function handleUpload() {
    if (!file) return;
    setShowConfirm(false);
    setStatus("uploading");
    setErrorMsg("");

    const stylePrompt = `Generate a ${selectedStyle} style avatar from this photo. ${prompt}`;

    try {
      const data = await toolsApi.uploadFile(TOOL_ID, file, stylePrompt);
      if (!data.output_file_url) {
        setStatus("error");
        setErrorMsg("Processing failed. This may be due to content filtering or the AI service being busy. Please try again with a different photo.");
        return;
      }
      setStatus("done");
      setResultUrl(data.output_file_url);
      setCreditsUsed(data.credits_used || CREDIT_COST);
      setShowToast(true);
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
          <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <span>AI Avatar Generator</span>
          <Link href={`/${locale}`} className="ml-auto text-xs text-blue-600 hover:text-blue-500 transition-colors">
            ← Back to Tools
          </Link>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          🎨 AI Avatar Generator
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Transform your photo into cartoon, anime, or professional avatars. Costs <span className="font-semibold text-blue-600">5 credits</span>.
        </p>

        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-950/20">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">📋 How to Use</p>
          <ol className="mt-2 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
            <li>1. Upload a <strong>clear front-facing photo</strong> — PNG, JPG, WebP (max 5MB)</li>
            <li>2. Select a style: Cartoon, Anime, Professional, Pixel Art, Watercolor, Oil Painting</li>
            <li>3. Optionally add a <strong>custom prompt</strong> to fine-tune (e.g., &quot;blue hair, glasses&quot;)</li>
            <li>4. Click <strong>Generate Avatar</strong> and wait ~10–30 seconds</li>
            <li>5. Download the generated avatar</li>
          </ol>
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-500">
            💡 Best results with <strong>well-lit, centered face</strong>. Avoid group photos, profiles, and low-light shots.
          </p>
        </div>
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
            <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">Upload a photo</p>
            <p className="mt-1 text-xs text-zinc-400">PNG, JPG, WebP — max 5MB</p>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Preview */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">Original</p>
                <img src={preview} alt="Original" className="w-full rounded-xl object-contain" />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">Result</p>
                <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
                  {status === "done" && resultUrl ? (
                    <img src={resultUrl} alt="Result" className="w-full rounded-xl object-contain" />
                  ) : status === "uploading" ? (
                    <div className="text-center">
                      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                      <p className="mt-2 text-sm text-zinc-500">Generating avatar...</p>
                    </div>
                  ) : status === "error" ? (
                    <p className="text-sm text-red-500">{errorMsg}</p>
                  ) : (
                    <p className="text-sm text-zinc-400">Configure style and generate to see result</p>
                  )}
                </div>
              </div>
            </div>

            {/* Style Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Style</label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {styles.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStyle(s.id)}
                    className={`rounded-lg border p-3 text-center transition-all ${
                      selectedStyle === s.id
                        ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20"
                        : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                    }`}
                  >
                    <span className="block text-xl">{s.icon}</span>
                    <span className="mt-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prompt */}
            <div>
              <label htmlFor="prompt" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Custom prompt (optional)
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                placeholder="e.g., Make me look like a wizard with blue hair"
              />
            </div>

            {/* Actions */}
            {status === "idle" && (
              <div className="flex gap-3">
                <button
                  onClick={handleUploadClick}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Generate Avatar ({CREDIT_COST} credits)
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
              <div className="flex gap-3">
                <a
                  href={resultUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                >
                  Download Avatar
                </a>
                <button
                  onClick={() => { setPreview(null); setFile(null); setResultUrl(null); setStatus("idle"); }}
                  className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
                >
                  Try Another Photo
                </button>
              </div>
            )}

            {/* Error retry */}
            {status === "error" && (
              <div className="flex gap-3">
                <button
                  onClick={handleUploadClick}
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
        )}
      </div>
      <CreditConfirmDialog
        isOpen={showConfirm}
        creditsNeeded={CREDIT_COST}
        currentCredits={user?.credits || 0}
        toolName={TOOL_NAME}
        locale={locale}
        onConfirm={handleUpload}
        onCancel={() => setShowConfirm(false)}
      />

      {showToast && (
        <CreditsUsedToast
          creditsUsed={creditsUsed}
          remaining={user?.credits || 0}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
