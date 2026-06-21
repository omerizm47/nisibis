import { useMemo } from 'react';
import placesData from '@/data/places.json';
import type { Place, PlaceCategory } from '@/types';
import { haversineDistance } from '@/utils/distance';
import { getDisplayCoordinate } from '@/utils/map';

const PLACES = placesData as unknown as Place[];

export function getAllPlaces(): Place[] {
  return PLACES;
}

export function getPlaceById(id: string): Place | undefined {
  return PLACES.find((p) => p.id === id);
}

export function getFeaturedPlaces(): Place[] {
  return PLACES.filter((p) => p.isFeatured);
}

/** id listesini, verilen sırayı koruyarak Place dizisine çevirir. */
export function getPlacesByIds(ids: string[]): Place[] {
  return ids
    .map((id) => PLACES.find((p) => p.id === id))
    .filter((p): p is Place => p != null);
}

export interface NearbyPlace {
  place: Place;
  meters: number;
}

/** Verilen mekana yürüme mesafesindeki (varsayılan 600 m) diğer mekanları döndürür. */
export function getNearbyPlaces(placeId: string, maxMeters = 600, limit = 3): NearbyPlace[] {
  const origin = PLACES.find((p) => p.id === placeId);
  const originCoord = origin ? getDisplayCoordinate(origin) : null;
  if (!origin || !originCoord) return [];
  return PLACES.filter((p) => p.id !== placeId)
    .map((p) => {
      const coord = getDisplayCoordinate(p);
      return coord ? { place: p, meters: haversineDistance(originCoord, coord) } : null;
    })
    .filter((x): x is NearbyPlace => x !== null && x.meters <= maxMeters)
    .sort((a, b) => a.meters - b.meters)
    .slice(0, limit);
}

export interface UsePlacesOptions {
  category?: PlaceCategory | 'all';
  query?: string;
}

/** Kategori ve metin aramasına göre filtrelenmiş mekan listesi. */
export function usePlaces(options: UsePlacesOptions = {}): Place[] {
  const { category = 'all', query = '' } = options;
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    return PLACES.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (!q) return true;
      const haystack = [p.name, p.shortDescription, p.category, ...(p.tags ?? [])]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [category, query]);
}
