"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie_consent";

interface CookieConsentProps {
  locale?: string;
}

export default function CookieConsent({ locale = "en" }: CookieConsentProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(STORAGE_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  const t = {
    en: {
      text: "This site uses cookies for Google AdSense and essential functionality. No personal data is collected without consent.",
      accept: "Accept",
      reject: "Reject",
      privacy: "Privacy Policy",
    },
    es: {
      text: "Este sitio usa cookies para Google AdSense y funcionalidad esencial. No se recopilan datos personales sin consentimiento.",
      accept: "Aceptar",
      reject: "Rechazar",
      privacy: "Política de Privacidad",
    },
    ar: {
      text: "يستخدم هذا الموقع ملفات تعريف الارتباط لـ Google AdSense والوظائف الأساسية. لا يتم جمع البيانات الشخصية دون موافقة.",
      accept: "قبول",
      reject: "رفض",
      privacy: "سياسة الخصوصية",
    },
  };

  const labels = t[locale as keyof typeof t] || t.en;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[99998] border-t border-zinc-200 bg-white px-4 py-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-900" role="dialog" aria-label="Cookie consent">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {labels.text}{" "}
          <Link href={`/${locale}/privacy`} className="font-medium text-blue-600 underline hover:text-blue-500">
            {labels.privacy}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={reject}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {labels.reject}
          </button>
          <button
            onClick={accept}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {labels.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
