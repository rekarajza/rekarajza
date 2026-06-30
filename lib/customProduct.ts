export const CUSTOM_SIZE_OPTIONS = ['A4 álló', 'A4 fekvő', 'Négyzetes 30×30 cm'] as const;

export const CUSTOM_TIER_OPTIONS = [
  { key: '0-2', label: '0–2 karakter', price: 18000 },
  { key: '3-4', label: '3–4 karakter', price: 25000 },
  { key: '4+', label: '4+ karakter', price: 30000 },
] as const;

export type CustomTierKey = (typeof CUSTOM_TIER_OPTIONS)[number]['key'];
export type CustomSize = (typeof CUSTOM_SIZE_OPTIONS)[number];

export const CUSTOM_OPTIONS_MARKER = '[OPCIOK]';
