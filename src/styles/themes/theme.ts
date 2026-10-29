import { colors, typography, radii, shadows } from '../tokens';

export const theme = {
  colors,
  typography,
  radii,
  shadows,
  brand: {
    name: 'ReRoute',
    tagline: 'Waste to Worth.',
    team: 'Syndicates',
    platform: 'AI-Powered Agricultural Waste Exchange Platform',
  },
} as const;

export default theme;
