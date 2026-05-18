"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useAuth } from "@/lib/auth-context";
import { useTool } from "@/hooks/useTool";
import { ToolSkeleton } from "@/components/LoadingSkeleton";
import { CreditConfirmDialog, CreditsUsedToast, LoginPromptDialog } from "@/components/CreditGuard";
import { getCreditCost } from "@/lib/creditCosts";
import type { Locale } from "@/lib/i18n";

const TOOL_ID = "text-to-speech";

const VOICES = [
  { id: "female", icon: "👩", label: "Female", desc: "Warm & natural" },
  { id: "male", icon: "👨", label: "Male", desc: "Deep & calm" },
  { id: "child", icon: "👶", label: "Child", desc: "Young & innocent" },
  { id: "cute", icon: "🌸", label: "Cute", desc: "Sweet & lively" },
  { id: "serious", icon: "🎙️", label: "Serious", desc: "Authoritative & bold" },
  { id: "formal", icon: "💼", label: "Formal", desc: "Professional & clear" },
];

const LANGUAGES = [
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
  { id: "ar", label: "العربية" },
  { id: "fr", label: "Français" },
  { id: "de", label: "Deutsch" },
  { id: "it", label: "Italiano" },
  { id: "pt", label: "Português" },
  { id: "ja", label: "日本語" },
  { id: "zh", label: "中文" },
  { id: "ko", label: "한국어" },
  { id: "hi", label: "हिन्दी" },
  { id: "ru", label: "Русский" },
  { id: "tr", label: "Türkçe" },
  { id: "pl", label: "Polski" },
  { id: "nl", label: "Nederlands" },
  { id: "cs", label: "Čeština" },
  { id: "hu", label: "Magyar" },
];

export default function TextToSpeechClient({ locale = "en" as Locale, dict }: { locale?: Locale; dict?: Record<string, unknown> }) {
  const { user, loading } = useAuth();
  const t = ((dict as any)?.tools?.[TOOL_ID] as Record<string, string>) || {};

  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en");
  const [voiceCategory, setVoiceCategory] = useState("female");

  const buildPrompt = () => text.trim() || undefined;
  const getStyle = () => voiceCategory;

  const tool = useTool({
    toolId: TOOL_ID,
    creditCost: getCreditCost(TOOL_ID),
    buildPrompt,
    getStyle,
    noFileRequired: true,
    locale,
    dict,
  });

  if (loading) return <ToolSkeleton />;

  return (
    <ToolLayout toolId={TOOL_ID} locale={locale} dict={dict}>
      <CreditConfirmDialog
        isOpen={!!user && tool.showConfirm && !tool.fileError}
        toolName={t.name || "AI Text to Speech"}
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
        {/* Text input */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            {t.textLabel || "Your Text"}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.textPlaceholder || "Type or paste the text you want to convert to speech..."}
            rows={6}
            maxLength={2000}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-base text-zinc-800 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder:text-zinc-500"
          />
          <p className="mt-1 text-xs text-zinc-400">{text.length}/2000</p>
        </div>

        {/* Voice selector */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            {t.voiceLabel || "Voice"}
          </label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {VOICES.map((v) => (
              <button
                key={v.id}
                onClick={() => setVoiceCategory(v.id)}
                className={`flex flex-col items-center rounded-xl border px-3 py-3 text-center transition-all ${
                  voiceCategory === v.id
                    ? "border-blue-600 bg-blue-50 shadow-sm dark:border-blue-500 dark:bg-blue-900/20"
                    : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
                }`}
              >
                <span className="text-2xl">{v.icon}</span>
                <span className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">{v.label}</span>
                <span className="mt-0.5 text-xs text-zinc-400">{v.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Language selector */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            {t.languageLabel || "Language"}
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-base text-zinc-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 sm:w-64"
          >
            {LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>{l.label}</option>
            ))}
          </select>
        </div>

        {/* Generate button */}
        <button
          onClick={() => tool.handleUploadClick()}
          disabled={!text.trim() || tool.status === "uploading"}
          className="rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
        >
          🎙️ {t.button || "Generate Speech (3 credits)"}
        </button>

        {tool.status === "uploading" && (
          <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-950/20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{t.generating || "Synthesizing speech..."}</span>
          </div>
        )}

        {tool.errorMsg && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300">
            {tool.errorMsg}
          </div>
        )}

        {/* Audio result */}
        {tool.status === "done" && tool.resultUrl && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              {t.resultLabel || "Your Audio"}
            </label>
            <audio controls className="w-full" key={tool.resultUrl}>
              <source src={tool.resultUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <div className="flex items-center gap-3">
              <a
                href={tool.resultUrl}
                download={`speech-${Date.now()}.mp3`}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                ⬇ {t.download || "Download MP3"}
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
