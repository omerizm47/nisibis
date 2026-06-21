import type { Place } from '@/types';
import { DEFAULT_REGION } from './constants';
import type { LatLng } from './distance';

export interface Region extends LatLng {
  latitudeDelta: number;
  longitudeDelta: number;
}

type CoordinateFields = Pick<
  Place,
  'latitude' | 'longitude' | 'approxLatitude' | 'approxLongitude'
>;

/**
 * Haritada gösterilecek koordinatı döndürür.
 * Önce doğrulanmış (latitude/longitude), yoksa yaklaşık değer kullanılır.
 * Hiçbiri yoksa null döner.
 */
export function getDisplayCoordinate(place: CoordinateFields): LatLng | null {
  if (place.latitude != null && place.longitude != null) {
    return { latitude: place.latitude, longitude: place.longitude };
  }
  if (place.approxLatitude != null && place.approxLongitude != null) {
    return { latitude: place.approxLatitude, longitude: place.approxLongitude };
  }
  return null;
}

export function placeHasMapLocation(place: CoordinateFields): boolean {
  return getDisplayCoordinate(place) != null;
}

export function regionForCoordinate(coord: LatLng, delta = 0.02): Region {
  return {
    latitude: coord.latitude,
    longitude: coord.longitude,
    latitudeDelta: delta,
    longitudeDelta: delta,
  };
}

/** Bir mekan kümesini kapsayan harita bölgesini hesaplar. */
export function regionForPlaces(places: CoordinateFields[]): Region {
  const coords = places
    .map(getDisplayCoordinate)
    .filter((c): c is LatLng => c != null);

  if (coords.length === 0) {
    return { ...DEFAULT_REGION };
  }

  let minLat = coords[0].latitude;
  let maxLat = coords[0].latitude;
  let minLng = coords[0].longitude;
  let maxLng = coords[0].longitude;

  for (const c of coords) {
    minLat = Math.min(minLat, c.latitude);
    maxLat = Math.max(maxLat, c.latitude);
    minLng = Math.min(minLng, c.longitude);
    maxLng = Math.max(maxLng, c.longitude);
  }

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * 1.6, 0.01),
    longitudeDelta: Math.max((maxLng - minLng) * 1.6, 0.01),
  };
}
