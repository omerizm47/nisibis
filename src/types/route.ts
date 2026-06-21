/** Rota zorluk seviyesi. */
export type RouteDifficulty = 'kolay' | 'orta' | 'zor';

/**
 * Hazır keşif rotası. `poiIds`, `src/data/places.json` içindeki mekan id'lerine
 * referans verir. `safetyNotes` nazik ziyaret notları içindir.
 */
export interface TourRoute {
  id: string;
  title: string;
  description: string;
  estimatedDuration: string;
  poiIds: string[];
  difficulty: RouteDifficulty;
  recommendedTime: string;
  highlights: string[];
  safetyNotes: string[];
}
