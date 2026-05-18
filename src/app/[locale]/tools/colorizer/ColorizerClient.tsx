"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useAuth } from "@/lib/auth-context";
import { useTool } from "@/hooks/useTool";
import { CreditConfirmDialog, CreditsUsedToast, LoginPromptDialog } from "@/components/CreditGuard";
import { getCreditCost } from "@/lib/creditCosts";
import type { Locale } from "@/lib/i18n";

const TOOL_ID = "colorizer";

export default function ColorizerClient({ locale = "en" as Locale, dict }: { locale?: Locale; dict?: Record<string, unknown> }) {
  const { user, loading } = useAuth();
  const t = ((dict as any)?.tools?.[TOOL_ID] as Record<string, string>) || {};

  const tool = useTool({
    toolId: TOOL_ID,
    creditCost: getCreditCost(TOOL_ID),
    locale,
    dict,
  });

  const [showOriginal, setShowOriginal] = useState(true);

  if (loading) return null;

  return (
    <ToolLayout toolId={TOOL_ID} locale={locale} dict={dict}>
      <CreditConfirmDialog
        isOpen={!!user && tool.showConfirm && !tool.fileError}
        toolName={t.name || "B&W Photo Colorizer"}
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
            {t.uploadLabel || "Upload Black & White Photo"}
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

        {/* Generate button */}
        <button
          onClick={() => tool.handleUploadClick()}
          disabled={!tool.file || tool.status === "uploading"}
          className="rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
        >
          🎨 {t.button || "Colorize Photo (2 credits)"}
        </button>

        {tool.status === "uploading" && (
          <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-950/20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{t.generating || "Colorizing your photo..."}</span>
          </div>
        )}

        {tool.errorMsg && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300">
            {tool.errorMsg}
          </div>
        )}

        {/* Before/After Result */}
        {tool.status === "done" && tool.resultUrl && tool.preview && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowOriginal(true)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  showOriginal ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                {t.before || "Before"}
              </button>
              <button
                onClick={() => setShowOriginal(false)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  !showOriginal ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                {t.after || "After"}
              </button>
            </div>
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
              <img
                src={showOriginal ? tool.preview : tool.resultUrl}
                alt={showOriginal ? "Original B&W" : "Colorized"}
                className="max-h-96 w-full object-contain"
              />
            </div>
            <div className="flex items-center gap-3">
              <a
                href={tool.resultUrl}
                download={`colorized-${Date.now()}.png`}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                ⬇ {t.download || "Download Colorized"}
              </a>
              <button
                onClick={tool.reset}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                🔄 {t.tryAnother || "Colorize Another"}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
