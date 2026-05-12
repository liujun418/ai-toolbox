const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Unsupported file format. Please use PNG, JPG, or WebP.";
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return "File too large. Maximum size is 10MB.";
  }
  return null;
}
