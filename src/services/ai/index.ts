/**
 * ReRoute AI Services
 *
 * Core agricultural waste intelligence modules:
 * - AI Reuse Advisor: Lignocellulosic crop residue pathway matching engine
 * - Circular Impact Engine: Deterministic mass-balance impact calculation
 */

export * from './aiReuseAdvisor';

export const AI_SERVICE_INFO = {
  version: '2.1.0',
  mode: 'Scientific Domain Expert Model (Demo Mode)',
  capabilities: [
    'Residue Lignocellulose Matching',
    'Moisture & Quality Pre-Processing Specifications',
    'Circular Economy Mass-Balance Scoring',
    'Industrial Off-taker Targeting',
  ],
} as const;
