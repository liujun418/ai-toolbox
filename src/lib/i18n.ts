export const locales = ["en", "es", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  ar: "العربية",
};

export const localeDir: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  es: "ltr",
  ar: "rtl",
};

export function isValidLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}

const dictionaries: Record<Locale, () => Promise<Record<string, unknown>>> = {
  en: () => import("@/locales/en/common.json").then((m) => m.default),
  es: () => import("@/locales/es/common.json").then((m) => m.default),
  ar: () => import("@/locales/ar/common.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Record<string, unknown>> {
  return dictionaries[locale]();
}
