import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { setActiveCity } from '@/data/activeCity';
import { CITIES, DEFAULT_CITY_ID, getOtherCity, isCityId } from '@/data/cities';
import { getStoredCity, migrateLegacyProgress, setStoredCity } from '@/storage/taskStorage';
import type { City, CityId } from '@/types';

interface CityContextValue {
  city: City;
  cityId: CityId;
  otherCity: City;
  setCity: (id: CityId) => void;
}

const CityContext = createContext<CityContextValue | undefined>(undefined);

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [cityId, setCityId] = useState<CityId | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      await migrateLegacyProgress(DEFAULT_CITY_ID);
      const stored = await getStoredCity();
      if (active) setCityId(isCityId(stored) ? stored : DEFAULT_CITY_ID);
    })();
    return () => {
      active = false;
    };
  }, []);

  const setCity = useCallback((id: CityId) => {
    setCityId(id);
    void setStoredCity(id);
  }, []);

  const value = useMemo<CityContextValue | null>(() => {
    if (!cityId) return null;
    return { city: CITIES[cityId], cityId, otherCity: getOtherCity(cityId), setCity };
  }, [cityId, setCity]);

  // Ağaçtan bağımsız yardımcılar da aynı şehri okumalı, o yüzden çocuklardan önce.
  if (!value) return null;
  setActiveCity(value.cityId);

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCity(): CityContextValue {
  const ctx = useContext(CityContext);
  if (!ctx) {
    throw new Error('useCity, CityProvider içinde kullanılmalıdır.');
  }
  return ctx;
}
