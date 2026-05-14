"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { toolsApi, authApi } from "@/lib/api";
import { useUsageTracker } from "@/hooks/useUsageTracker";
import { validateImageFile } from "@/lib/fileValidation";
import type { Locale } from "@/lib/i18n";

export interface UseToolOptions {
  toolId: string;
  creditCost: number;
  /** Build the prompt from tool-specific options. Return undefined for tools without prompt. */
  buildPrompt?: (options: Record<string, unknown>) => string | undefined;
  /** Build a style string sent as a dedicated form field (used by avatar-generator). */
  getStyle?: (options: Record<string, unknown>) => string | undefined;
  /** Build a background color string sent as form field (used by background-remover). */
  getBgColor?: (options: Record<string, unknown>) => string | undefined;
  /** For tools that use canvas masks (background-remover, watermark-remover). */
  getMask?: () => Promise<Blob | null>;
  onSuccess?: (resultUrl: string) => void;
  locale: Locale;
  dict?: Record<string, unknown>;
}

export interface UseToolReturn {
  file: File | null;
  preview: string | null;
  status: "idle" | "uploading" | "done" | "error";
  resultUrl: string | null;
  errorMsg: string;
  creditsUsed: number;
  showConfirm: boolean;
  showToast: boolean;
  fileRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUploadClick: () => void;
  handleUpload: (promptOptions: Record<string, unknown>) => Promise<void>;
  reset: () => void;
  setShowConfirm: (v: boolean) => void;
  setShowToast: (v: boolean) => void;
  fileError: string | null;
}

export function useTool(options: UseToolOptions): UseToolReturn {
  const { toolId, creditCost, buildPrompt, getStyle, getBgColor, getMask, onSuccess, locale } = options;
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  // Track usage when credits are consumed
  const toolName = ((options.dict as any)?.[toolId.replace(/-/g, "_")] as any)?.title || toolId;
  useUsageTracker({
    toolId,
    toolName,
    icon: "⚡",
    creditsUsed,
    trigger: creditsUsed > 0,
  });

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // Validate file
    const error = validateImageFile(f);
    if (error) {
      setFileError(error);
      setFile(null);
      setPreview(null);
      return;
    }

    setFileError(null);
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    setStatus("idle");
    setResultUrl(null);
    setErrorMsg("");
  }, []);

  const handleUploadClick = useCallback(() => {
    if (!file) return;
    setShowConfirm(true);
  }, [file]);

  const handleUpload = useCallback(async (promptOptions: Record<string, unknown>) => {
    if (!file) return;
    // Not authenticated: show login prompt
    if (!user) {
      setShowConfirm(true);
      return;
    }

    // Insufficient credits: go directly to purchase
    if (user.credits < creditCost) {
      setShowConfirm(true);
      return;
    }

    // Authenticated with enough credits — proceed with upload
    setShowConfirm(false);
    setStatus("uploading");
    setErrorMsg("");
    setFileError(null);

    try {
      let prompt = buildPrompt?.(promptOptions);
      let style = getStyle?.(promptOptions);
      let bgColor = getBgColor?.(promptOptions);
      let mask: Blob | undefined;
      if (getMask) {
        mask = await getMask() ?? undefined;
      }

      const data = await toolsApi.uploadFile(toolId, file, prompt, mask, style, bgColor);

      if (!data.output_file_url) {
        setStatus("error");
        // Use backend error message if available, otherwise give a helpful default
        if (data.error_message) {
          setErrorMsg(data.error_message);
        } else {
          setErrorMsg("The AI couldn't process this image. The file may be corrupted, too small, or in an unsupported format. Try a different image — PNG or JPG works best.");
        }
        return;
      }

      setStatus("done");
      setResultUrl(data.output_file_url);
      const cost = data.credits_used || creditCost;
      setCreditsUsed(cost);

      // Optimistic credit update (use functional form to avoid stale closure)
      updateUser((prev) => ({ credits: prev.credits - cost }));

      // Background refresh to correct any discrepancies
      authApi.me().then((u) => updateUser(u)).catch(() => {});

      setShowToast(true);
      onSuccess?.(data.output_file_url);
    } catch (err) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      // Map common API errors to friendly messages
      if (msg.includes("Not enough credits")) {
        setErrorMsg("Not enough credits. Please purchase more to continue.");
      } else if (msg.includes("File too large")) {
        setErrorMsg("This file is too large. Maximum size is 3MB. Try a smaller image.");
      } else if (msg.includes("Empty file")) {
        setErrorMsg("The uploaded file appears to be empty. Please select a valid image.");
      } else if (msg.includes("Unsupported") || msg.includes("format")) {
        setErrorMsg("This file format isn't supported. Please use PNG, JPG, or WebP.");
      } else {
        setErrorMsg(msg);
      }
    }
  }, [file, toolId, creditCost, buildPrompt, getMask, onSuccess, user, updateUser]);

  const reset = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
    setResultUrl(null);
    setStatus("idle");
    setErrorMsg("");
    setFileError(null);
    setCreditsUsed(0);
    setShowToast(false);
    if (fileRef.current) fileRef.current.value = "";
  }, [preview]);

  return {
    file,
    preview,
    status,
    resultUrl,
    errorMsg,
    creditsUsed,
    showConfirm,
    showToast,
    fileRef,
    handleFileChange,
    handleUploadClick,
    handleUpload,
    reset,
    setShowConfirm,
    setShowToast,
    fileError,
  };
}
