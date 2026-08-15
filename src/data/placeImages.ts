import type { ImageSourcePropType } from 'react-native';
import type { Place } from '@/types';
import { getActiveCity } from './activeCity';

export interface PlaceImageEntry {
  source: ImageSourcePropType;
  credit: string;
  license: string;
  sourceUrl: string;
}

/**
 * Bir mekanın paketlenmiş görselleri, künyeleriyle ve sırayla.
 * İlk eleman ana görseldir; kalanlar `place.gallery` kayıtlarıyla eşleşir.
 */
export function getPlaceImages(place: Place): PlaceImageEntry[] {
  const bundled = getActiveCity().images[place.id] ?? [];
  const meta = [
    { credit: place.imageCredit, license: place.imageLicense, sourceUrl: place.imageSourceUrl },
    ...(place.gallery ?? []),
  ];
  return bundled.map((source, i) => ({ source, ...(meta[i] ?? meta[0]) }));
}

/** Kart ve liste görünümleri için tek görsel: paketlenmiş ilki, yoksa uzak URL. */
export function getPlaceImageSource(place: { id: string; image?: string }): ImageSourcePropType {
  return getActiveCity().images[place.id]?.[0] ?? { uri: place.image ?? '' };
}
