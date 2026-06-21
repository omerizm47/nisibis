import type { PlaceCategory } from '@/types';
import { colors } from './colors';

/**
 * Kategori meta verisi: marker/rozet ikonu, rengi ve i18n etiket anahtarı.
 * İkonlar @expo/vector-icons MaterialCommunityIcons setindendir.
 */
export interface CategoryMeta {
  icon: string;
  color: string;
  labelKey: string;
}

export const categoryMeta: Record<PlaceCategory, CategoryMeta> = {
  tarihi: { icon: 'bank', color: colors.sand, labelKey: 'categories.tarihi' },
  'inanc-kultur': { icon: 'hands-pray', color: colors.primary, labelKey: 'categories.inanc-kultur' },
  carsi: { icon: 'storefront', color: colors.clay, labelKey: 'categories.carsi' },
  fotograf: { icon: 'camera', color: colors.info, labelKey: 'categories.fotograf' },
  'yemek-icecek': { icon: 'coffee', color: '#C08457', labelKey: 'categories.yemek-icecek' },
  park: { icon: 'tree', color: '#6FBF73', labelKey: 'categories.park' },
  'yerel-deneyim': { icon: 'hand-heart', color: '#D08C60', labelKey: 'categories.yerel-deneyim' },
};

export function getCategoryMeta(category: PlaceCategory): CategoryMeta {
  return categoryMeta[category] ?? categoryMeta.tarihi;
}
