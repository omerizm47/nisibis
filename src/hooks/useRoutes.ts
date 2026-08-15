import { getActiveCity } from '@/data/activeCity';
import type { Place, TourRoute } from '@/types';
import { getPlaceById } from './usePlaces';

export function getAllRoutes(): TourRoute[] {
  return getActiveCity().routes;
}

export function getRouteById(id: string): TourRoute | undefined {
  return getAllRoutes().find((r) => r.id === id);
}

/** Rotanın duraklarını (mekanları) sırayla döndürür. */
export function getRoutePlaces(route: TourRoute): Place[] {
  return route.poiIds
    .map((id) => getPlaceById(id))
    .filter((p): p is Place => p != null);
}

export function useRoutes(): TourRoute[] {
  return getAllRoutes();
}
