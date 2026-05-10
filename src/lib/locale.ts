export function getLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (["en", "es", "ar"].includes(segments[0])) return segments[0];
  return "en";
}
