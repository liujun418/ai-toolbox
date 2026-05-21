"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname } from "@/lib/locale";

const T: Record<string, Record<string, string>> = {
  en: { title: "Page Not Found", desc: "The page you are looking for doesn't exist or has been moved.", goHome: "Go Home", viewPricing: "View Pricing" },
  es: { title: "Pagina No Encontrada", desc: "La pagina que buscas no existe o ha sido movida.", goHome: "Ir al Inicio", viewPricing: "Ver Precios" },
  ar: { title: "الصفحة غير موجودة", desc: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.", goHome: "الذهاب للرئيسية", viewPricing: "عرض الأسعار" },
};

export default function NotFoundClient() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const t = T[locale] || T.en;

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
      <div className="mb-4 text-8xl font-bold text-zinc-200 dark:text-zinc-800">404</div>
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{t.title}</h1>
      <p className="mt-3 text-zinc-500 dark:text-zinc-400">{t.desc}</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href={`/${locale}`} className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900">
          {t.goHome}
        </Link>
        <Link href={`/${locale}/pricing`} className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
          {t.viewPricing}
        </Link>
      </div>
    </div>
  );
}
