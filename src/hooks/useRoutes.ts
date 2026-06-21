import routesData from '@/data/routes.json';
import type { Place, TourRoute } from '@/types';
import { getPlaceById } from './usePlaces';

const ROUTES = routesData as unknown as TourRoute[];

export function getAllRoutes(): TourRoute[] {
  return ROUTES;
}

export function getRouteById(id: string): TourRoute | undefined {
  return ROUTES.find((r) => r.id === id);
}

/** Rotanın duraklarını (mekanları) sırayla döndürür. */
export function getRoutePlaces(route: TourRoute): Place[] {
  return route.poiIds
    .map((id) => getPlaceById(id))
    .filter((p): p is Place => p != null);
}

export function useRoutes(): TourRoute[] {
  return ROUTES;
}
