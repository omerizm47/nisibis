/** Uygulama genelinde paylaşılan sabitler. */

/** Şehirden bağımsız AsyncStorage anahtarları. */
export const STORAGE_KEYS = {
  onboardingComplete: 'nisibis:onboarding_complete',
  language: 'nisibis:language',
  city: 'nisibis:city',
} as const;

/** İlerleme anahtarları şehir başınadır; her şehrin turu ayrı yüzde ile ilerler. */
export function progressKeys(cityId: string) {
  return {
    completedTasks: `nisibis:completed_tasks:${cityId}`,
    completedPlaces: `nisibis:completed_places:${cityId}`,
  } as const;
}

/** Tek şehirli sürümden kalan anahtarlar. Bir kez Nusaybin'e taşınıp silinirler. */
export const LEGACY_PROGRESS_KEYS = {
  completedTasks: 'nisibis:completed_tasks',
  completedPlaces: 'nisibis:completed_places',
} as const;

/**
 * Sıcak, açık tonlu OSM tabanlı döşeme sağlayıcısı (CARTO Voyager).
 * Krem zemin, mavi su ve yeşil parklarıyla "Taş & Güneş" sıcak temasıyla uyumludur.
 * Sokak ve yer adları döşemeye gömülüdür; ticari POI içermez. Google'ın üstte çizdiği
 * POI'ler ayrıca MAP_STYLE ile gizlenir — böylece sokak adları görünür ama ERDİ USTA
 * gibi POI'ler görünmez. Ücretsiz, API anahtarı gerektirmez. Atıf zorunludur.
 */
export const MAP_TILE_URL = 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
export const MAP_ATTRIBUTION = '© OpenStreetMap contributors, © CARTO';

/**
 * Google taban haritası stili (Android'de PROVIDER_DEFAULT = Google). Tüm etiketler,
 * POI'ler ve toplu taşıma kapatılır; böylece Google'ın döşeme katmanının üstüne çizdiği
 * ERDİ USTA, restoran vb. POI'ler görünmez — haritada yalnızca kendi işaretçilerimiz kalır.
 */
export const MAP_STYLE = [
  { elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

export const SUPPORTED_LANGUAGES = ['tr', 'en', 'ar'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];
