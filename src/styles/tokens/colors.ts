/**
 * ReRoute Design Tokens - Color Palette
 * Project: AI-Powered Agricultural Waste Exchange Platform (ReRoute)
 * Team: Syndicates
 */

export const colors = {
  // Primary Brand Identity
  midnightIndigo: '#1D1160',
  deepPurple: '#33006F',
  
  // Sustainability & Agricultural Elements
  forestGreen: '#17483C',
  sageGreen: '#8FBC8B',
  leafGreen: '#088A1A',
  freshGreen: '#67C273',

  // Surfaces & Backgrounds
  mistBlue: '#E6EEF2',
  warmCream: '#F4F0DF',
  pureWhite: '#FFFFFF',
  canvasOffWhite: '#FBFDFB',
  surfaceCard: '#FFFFFF',
  surfaceMuted: '#F4F7F5',
  borderSubtle: '#E2EBE5',

  // Metrics & Highlights
  harvestGold: '#EDD17E',
  harvestGoldDark: '#9E822E',

  // Secondary Actions & Positive States
  teal: '#317787',
  tealDark: '#205561',

  // Occasional Data-Visualization Accents Only
  rosePink: '#FF87AF',
  brightCyan: '#26CBF0',
} as const;

export type ColorToken = keyof typeof colors;
