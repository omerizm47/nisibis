/** Uygulama genelinde paylaşılan sabitler. */

/** AsyncStorage anahtarları. */
export const STORAGE_KEYS = {
  onboardingComplete: 'nisibis:onboarding_complete',
  completedTasks: 'nisibis:completed_tasks',
  completedPlaces: 'nisibis:completed_places',
  language: 'nisibis:language',
} as const;

/** Nusaybin şehir merkezi (yaklaşık demir-çıpa). Kaynak: Vikipedi koordinatları. */
export const NUSAYBIN_CENTER = {
  latitude: 37.0747,
  longitude: 41.2156,
} as const;

/** Harita açılış bölgesi: Nusaybin merkez durakları yakından gösteren dar görünüm. */
export const DEFAULT_REGION = {
  latitude: 37.0725,
  longitude: 41.2152,
  latitudeDelta: 0.017,
  longitudeDelta: 0.012,
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
