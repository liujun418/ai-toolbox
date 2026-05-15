/**
 * Credit costs for each tool — single source of truth.
 * Keep in sync with ai-toolbox-api/app/schemas.py CREDIT_COSTS.
 */
export const CREDIT_COSTS: Record<string, number> = {
  "ai-image-generator": 1, // base cost; actual varies by quality/count/reference
  "avatar-generator": 5,
  "background-remover": 2,
  "watermark-remover": 3,
  "photo-restorer": 5,
  "pdf-to-word": 0, // free — local processing only
  "image-upscaler": 2,
  "style-transfer": 4,
  "text-polish": 3,
} as const;

export function getCreditCost(toolId: string): number {
  return CREDIT_COSTS[toolId] ?? 0;
}
