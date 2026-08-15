import { useMemo } from 'react';
import { getActiveCity } from '@/data/activeCity';
import type { Place, PlaceCategory } from '@/types';
import { haversineDistance } from '@/utils/distance';
import { getDisplayCoordinate } from '@/utils/map';

export function getAllPlaces(): Place[] {
  return getActiveCity().places;
}

export function getPlaceById(id: string): Place | undefined {
  return getAllPlaces().find((p) => p.id === id);
}

export function getFeaturedPlaces(): Place[] {
  return getAllPlaces().filter((p) => p.isFeatured);
}

/** id listesini, verilen sırayı koruyarak Place dizisine çevirir. */
export function getPlacesByIds(ids: string[]): Place[] {
  const places = getAllPlaces();
  return ids
    .map((id) => places.find((p) => p.id === id))
    .filter((p): p is Place => p != null);
}

export interface NearbyPlace {
  place: Place;
  meters: number;
}

/** Verilen mekana yürüme mesafesindeki (varsayılan 600 m) diğer mekanları döndürür. */
export function getNearbyPlaces(placeId: string, maxMeters = 600, limit = 3): NearbyPlace[] {
  const places = getAllPlaces();
  const origin = places.find((p) => p.id === placeId);
  const originCoord = origin ? getDisplayCoordinate(origin) : null;
  if (!origin || !originCoord) return [];
  return places
    .filter((p) => p.id !== placeId)
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
  const places = getAllPlaces();
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    return places.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (!q) return true;
      const haystack = [p.name, p.shortDescription, p.category, ...(p.tags ?? [])]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [places, category, query]);
}
