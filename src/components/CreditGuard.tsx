"use client";

import { useState } from "react";
import Link from "next/link";

interface CreditGuardProps {
  isOpen: boolean;
  creditsNeeded: number;
  currentCredits: number;
  toolName: string;
  locale: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CreditConfirmDialog({
  isOpen,
  creditsNeeded,
  currentCredits,
  toolName,
  locale,
  onConfirm,
  onCancel,
}: CreditGuardProps) {
  if (!isOpen) return null;

  const canAfford = currentCredits >= creditsNeeded;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        {canAfford ? (
          <>
            <div className="mb-4 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Confirm Credit Usage</h3>
              <p className="mt-1 text-sm text-zinc-500">
                {toolName} requires <span className="font-semibold text-blue-600">{creditsNeeded} credits</span>
              </p>
            </div>

            <div className="mb-4 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Current balance</span>
                <span className="font-semibold text-zinc-900 dark:text-white">{currentCredits}</span>
              </div>
              <div className="mt-1 flex justify-between text-sm">
                <span className="text-zinc-500">Cost</span>
                <span className="font-semibold text-red-600">-{creditsNeeded}</span>
              </div>
              <div className="mt-2 border-t border-zinc-200 pt-2 flex justify-between text-sm dark:border-zinc-700">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">After</span>
                <span className="font-semibold text-zinc-900 dark:text-white">{currentCredits - creditsNeeded}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">
                Cancel
              </button>
              <button onClick={onConfirm} className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                Use {creditsNeeded} Credits
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Insufficient Credits</h3>
              <p className="mt-1 text-sm text-zinc-500">
                {toolName} needs <span className="font-semibold text-red-600">{creditsNeeded} credits</span> but you only have{" "}
                <span className="font-semibold">{currentCredits}</span>.
              </p>
            </div>

            <div className="mb-4 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
              <p className="text-sm text-red-700 dark:text-red-400">
                You need <strong>{creditsNeeded - currentCredits} more credits</strong>. Please purchase credits to continue.
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">
                Cancel
              </button>
              <Link href={`/${locale}/pricing`} className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700">
                Buy Credits
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function CreditsUsedToast({
  creditsUsed,
  remaining,
  onClose,
}: {
  creditsUsed: number;
  remaining: number;
  onClose: () => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right rounded-xl border border-green-200 bg-white p-4 shadow-lg dark:border-green-800 dark:bg-zinc-900">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">Credits Used</p>
          <p className="text-xs text-zinc-500">
            <span className="text-red-600 font-medium">-{creditsUsed}</span> · {remaining} remaining
          </p>
        </div>
        <button onClick={onClose} className="ml-4 text-zinc-400 hover:text-zinc-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
