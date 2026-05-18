"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useAuth } from "@/lib/auth-context";
import { useTool } from "@/hooks/useTool";
import { CreditConfirmDialog, CreditsUsedToast, LoginPromptDialog } from "@/components/CreditGuard";
import { getCreditCost } from "@/lib/creditCosts";
import type { Locale } from "@/lib/i18n";

const TOOL_ID = "image-description";

export default function ImageDescriptionClient({ locale = "en" as Locale, dict }: { locale?: Locale; dict?: Record<string, unknown> }) {
  const { user, loading } = useAuth();
  const t = ((dict as any)?.tools?.[TOOL_ID] as Record<string, string>) || {};

  const [customPrompt, setCustomPrompt] = useState("");

  const buildPrompt = () => customPrompt.trim() || undefined;

  const tool = useTool({
    toolId: TOOL_ID,
    creditCost: getCreditCost(TOOL_ID),
    buildPrompt,
    locale,
    dict,
  });

  const [description, setDescription] = useState<string | null>(null);
  useEffect(() => {
    if (tool.resultUrl) {
      fetch(tool.resultUrl)
        .then((r) => r.text())
        .then(setDescription)
        .catch(() => setDescription("Failed to load description."));
    } else {
      setDescription(null);
    }
  }, [tool.resultUrl]);

  // Parse ALT and DESC from output
  const altMatch = description?.match(/^ALT:\s*(.+)$/m);
  const descMatch = description?.match(/^DESC:\s*(.+)$/m);
  const altText = altMatch?.[1]?.trim();
  const descText = descMatch?.[1]?.trim() || description;

  if (loading) return null;

  return (
    <ToolLayout toolId={TOOL_ID} locale={locale} dict={dict}>
      <CreditConfirmDialog
        isOpen={!!user && tool.showConfirm && !tool.fileError}
        toolName={t.name || "AI Image Describer"}
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
        {/* Image upload */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            {t.uploadLabel || "Upload Image"}
          </label>
          <input
            ref={tool.fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={tool.handleFileChange}
            className="w-full text-sm text-zinc-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700 dark:text-zinc-400"
          />
          {tool.fileError && <p className="mt-1 text-sm text-red-600">{tool.fileError}</p>}
          {tool.preview && (
            <img src={tool.preview} alt="Preview" className="mt-3 max-h-64 rounded-xl border border-zinc-200 object-contain dark:border-zinc-700" />
          )}
        </div>

        {/* Custom prompt */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            {t.promptLabel || "Custom Question (optional)"}
          </label>
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder={t.promptPlaceholder || "e.g., What breed is the dog? How many people are there?"}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder:text-zinc-500"
          />
        </div>

        {/* Generate button */}
        <button
          onClick={() => tool.handleUploadClick()}
          disabled={!tool.file || tool.status === "uploading"}
          className="rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
        >
          🖼️ {t.button || "Describe Image (2 credits)"}
        </button>

        {tool.status === "uploading" && (
          <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-950/20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{t.generating || "Analyzing image..."}</span>
          </div>
        )}

        {tool.errorMsg && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300">
            {tool.errorMsg}
          </div>
        )}

        {/* Result */}
        {tool.status === "done" && description !== null && (
          <div className="space-y-3">
            {altText && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20">
                <p className="mb-1 text-xs font-semibold uppercase text-green-600 dark:text-green-400">ALT Text (SEO)</p>
                <p className="text-sm text-green-800 dark:text-green-200">{altText}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(altText)}
                  className="mt-2 rounded-lg border border-green-300 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900"
                >
                  📋 {t.copyAlt || "Copy ALT"}
                </button>
              </div>
            )}
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
              <p className="mb-1 text-xs font-semibold uppercase text-zinc-400">Description</p>
              <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{descText}</p>
              <button
                onClick={() => navigator.clipboard.writeText(descText || "")}
                className="mt-2 rounded-lg border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                📋 {t.copyDesc || "Copy Description"}
              </button>
            </div>
            <button
              onClick={tool.reset}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              🔄 {t.tryAnother || "Describe Another"}
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
