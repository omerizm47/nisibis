import type { PlaceCategory, VerificationStatus } from './category';

/** Bir mekan için kaynak/atıf kaydı. */
export interface PlaceSource {
  title: string;
  url?: string;
}

/**
 * Turistik bir nokta (POI).
 *
 * Koordinat politikası:
 * - `latitude` / `longitude`: yalnızca resmî veya güvenilir bir harita kaynağından
 *   DOĞRULANDIĞINDA doldurulur. Aksi halde `null` kalır (KESİN KURAL).
 * - `approxLatitude` / `approxLongitude`: MVP haritasının çalışabilmesi için
 *   YAKLAŞIK konumdur; `coordinatesVerified` false ise arayüzde "yaklaşık" rozeti gösterilir.
 *
 * Not: `safetyNotes` alanı güvenlik tehdidi değil, nazik "Ziyaret Notları"
 * (ziyaret saatleri, ibadet mekânı görgüsü, fotoğraf nezaketi) içindir.
 */
export interface Place {
  id: string;
  name: string;
  slug: string;
  category: PlaceCategory;
  shortDescription: string;
  longDescription: string;
  history: string;
  activities: string[];
  tips: string[];
  photoTips: string[];
  safetyNotes: string[];
  image: string;
  imageCredit: string;
  imageLicense: string;
  imageSourceUrl: string;
  latitude: number | null;
  longitude: number | null;
  approxLatitude: number | null;
  approxLongitude: number | null;
  coordinatesVerified: boolean;
  estimatedVisitMinutes: number;
  tags: string[];
  isFeatured: boolean;
  sources: PlaceSource[];
  verificationStatus: VerificationStatus;
}
