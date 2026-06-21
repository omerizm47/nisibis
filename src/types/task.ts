import type { PlaceCategory } from './category';

/** Görev kategorisi: mekan kategorileri + genel. */
export type TaskCategory = PlaceCategory | 'genel';

/**
 * Oyunlaştırılmış görev. `relatedPoiId` bir mekana bağlıysa o mekanın id'sidir,
 * bağımsız bir görevse `null` olur.
 */
export interface TourTask {
  id: string;
  title: string;
  description: string;
  relatedPoiId: string | null;
  points: number;
  category: TaskCategory;
  /** @expo/vector-icons (MaterialCommunityIcons) ikon adı. */
  icon: string;
}
