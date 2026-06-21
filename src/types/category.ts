/**
 * POI (mekan) kategorileri. Marker ikonları ve renkleri için
 * `src/theme/categories.ts` içindeki meta haritasına bakın.
 */
export type PlaceCategory =
  | 'tarihi'
  | 'inanc-kultur'
  | 'carsi'
  | 'fotograf'
  | 'yemek-icecek'
  | 'park'
  | 'yerel-deneyim';

export const PLACE_CATEGORIES: readonly PlaceCategory[] = [
  'tarihi',
  'inanc-kultur',
  'carsi',
  'fotograf',
  'yemek-icecek',
  'park',
  'yerel-deneyim',
] as const;

/** İçeriğin kaynakla doğrulanıp doğrulanmadığını belirtir. */
export type VerificationStatus = 'verified' | 'needs_review';
