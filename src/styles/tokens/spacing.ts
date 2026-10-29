/**
 * ReRoute Design Tokens - Spacing, Radii, Shadows
 * Buttons strictly rectangular with slightly rounded corners (5–8px border radius).
 * No pill-shaped buttons. No oversized capsules.
 */

export const radii = {
  none: '0px',
  sm: '4px',
  button: '6px', // 5-8px rectangular with slightly rounded corners
  card: '8px',
  md: '8px',
  lg: '12px',
} as const;

export const shadows = {
  subtle: '0 1px 3px 0 rgba(23, 72, 60, 0.05), 0 1px 2px -1px rgba(23, 72, 60, 0.05)',
  card: '0 4px 6px -1px rgba(29, 17, 96, 0.04), 0 2px 4px -2px rgba(29, 17, 96, 0.03)',
  elevated: '0 10px 15px -3px rgba(29, 17, 96, 0.07), 0 4px 6px -4px rgba(29, 17, 96, 0.04)',
} as const;
