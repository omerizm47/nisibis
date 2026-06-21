export { colors, gradients } from './colors';
export type { AppColors } from './colors';
export { spacing, radius, shadow } from './spacing';
export { typography, fontFamily, fontSize } from './typography';
export { categoryMeta, getCategoryMeta } from './categories';
export type { CategoryMeta } from './categories';

import { colors, gradients } from './colors';
import { spacing, radius, shadow } from './spacing';
import { typography, fontFamily, fontSize } from './typography';

/** Tek noktadan erişim için birleşik tema nesnesi. */
export const theme = {
  colors,
  gradients,
  spacing,
  radius,
  shadow,
  typography,
  fontFamily,
  fontSize,
} as const;

export type Theme = typeof theme;
