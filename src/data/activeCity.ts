import type { City, CityId } from '@/types';
import { CITIES, DEFAULT_CITY_ID } from './cities';

/**
 * Aktif şehir, React ağacının dışındaki yardımcı fonksiyonların
 * (getPlaceById, getRouteById, ...) da okuyabilmesi için modül düzeyinde tutulur.
 * Tek yazan `CityProvider`; çocukları render edilmeden önce burayı günceller.
 */
let active: City = CITIES[DEFAULT_CITY_ID];

export function getActiveCity(): City {
  return active;
}

export function setActiveCity(id: CityId): void {
  active = CITIES[id] ?? CITIES[DEFAULT_CITY_ID];
}
