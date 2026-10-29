/**
 * ReRoute Design Tokens - Typography
 * Manrope for headings, hero typography, brand wordmark, metric numerals
 * Inter for body text, navigation, buttons, forms, and small labels
 */

export const typography = {
  fonts: {
    heading: 'Manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
} as const;
