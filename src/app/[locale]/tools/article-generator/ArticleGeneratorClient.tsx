"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useAuth } from "@/lib/auth-context";
import { useTool } from "@/hooks/useTool";
import { ToolSkeleton } from "@/components/LoadingSkeleton";
import { CreditConfirmDialog, CreditsUsedToast, LoginPromptDialog } from "@/components/CreditGuard";
import { getCreditCost } from "@/lib/creditCosts";
import type { Locale } from "@/lib/i18n";

const TOOL_ID = "article-generator";

const TONES = [
  { id: "neutral", label: "Neutral", desc: "Balanced and objective" },
  { id: "professional", label: "Professional", desc: "Formal business style" },
  { id: "casual", label: "Casual", desc: "Friendly and conversational" },
  { id: "persuasive", label: "Persuasive", desc: "Compelling and convincing" },
  { id: "enthusiastic", label: "Enthusiastic", desc: "Energetic and inspiring" },
];

const WORD_PRESETS = [
  { value: 300, label: "300" },
  { value: 600, label: "600" },
  { value: 1000, label: "1000" },
  { value: 1500, label: "1500" },
];

export default function ArticleGeneratorClient({ locale = "en" as Locale, dict }: { locale?: Locale; dict?: Record<string, unknown> }) {
  const { user, loading } = useAuth();
  const t = ((dict as any)?.tools?.[TOOL_ID] as Record<string, string>) || {};
  const tp = (dict as any)?.toolPage || {};

  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("neutral");
  const [wordCount, setWordCount] = useState(600);

  const buildPrompt = () => {
    if (!topic.trim()) return undefined;
    return `WordCount: ${wordCount} | Topic: ${topic.trim()} | Keywords: ${keywords.trim()} | Tone: ${tone}`;
  };

  const tool = useTool({
    toolId: TOOL_ID,
    creditCost: getCreditCost(TOOL_ID),
    buildPrompt,
    noFileRequired: true,
    locale,
    dict,
  });

  const content = tool.resultContent;

  if (loading) return <ToolSkeleton />;

  return (
    <ToolLayout toolId={TOOL_ID} locale={locale} dict={dict}>
      <CreditConfirmDialog
        isOpen={!!user && tool.showConfirm && !tool.fileError}
        toolName={t.name || "AI Article Generator"}
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
        {/* Topic input */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            {t.topicLabel || "Topic"}
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={t.topicPlaceholder || "e.g., How AI is changing small business marketing in 2026"}
            rows={3}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder:text-zinc-500"
          />
        </div>

        {/* Keywords */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            {t.keywordsLabel || "Keywords (optional)"}
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder={t.keywordsPlaceholder || "AI, small business, marketing, automation"}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder:text-zinc-500"
          />
        </div>

        {/* Tone selector */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            {t.toneLabel || "Tone"}
          </label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((s) => (
              <button
                key={s.id}
                onClick={() => setTone(s.id)}
                disabled={tool.status === "uploading"}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  tone === s.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
                title={s.desc}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Word count */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            {t.wordCountLabel || "Word Count"}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={wordCount}
              onChange={(e) => setWordCount(Math.max(50, Math.min(5000, parseInt(e.target.value) || 300)))}
              min={50} max={5000} step={50}
              disabled={tool.status === "uploading"}
              className="w-28 rounded-xl border border-zinc-300 px-4 py-3 text-base text-zinc-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            />
            <span className="text-sm text-zinc-500 dark:text-zinc-400">words</span>
            <div className="flex gap-1">
              {WORD_PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setWordCount(p.value)}
                  disabled={tool.status === "uploading"}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
                    wordCount === p.value
                      ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-300"
                      : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={() => tool.handleUploadClick()}
          disabled={!topic.trim() || tool.status === "uploading"}
          className="rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
        >
          📝 {t.button || "Generate Article (3 credits)"}
        </button>

        {tool.status === "uploading" && (
          <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-950/20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{t.generating || "Generating article..."}</span>
          </div>
        )}

        {/* Result */}
        {tool.status === "done" && content !== null && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              {t.resultLabel || "Your Article"}
            </label>
            <div className="max-h-96 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {content}
              </pre>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigator.clipboard.writeText(content)}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                📋 {t.copy || "Copy to Clipboard"}
              </button>
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(content)}`}
                download={`article-${Date.now()}.txt`}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                ⬇ {t.download || "Download as Text"}
              </a>
              <button
                onClick={tool.reset}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                🔄 {t.tryAnother || "Generate Another"}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
