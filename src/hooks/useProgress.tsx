import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  clearProgress as clearStoredProgress,
  getCompletedPlaceIds,
  getCompletedTaskIds,
  setCompletedPlaceIds,
  setCompletedTaskIds,
} from '@/storage/taskStorage';
import type { CityId } from '@/types';
import { useCity } from './useCity';

export interface ProgressContextValue {
  loaded: boolean;
  completedTaskIds: string[];
  completedPlaceIds: string[];
  isTaskCompleted: (id: string) => boolean;
  isPlaceCompleted: (id: string) => boolean;
  /** Uygulanmadiysa false doner; cagiran taraf kutlamayi buna gore yapar. */
  toggleTask: (id: string) => boolean;
  completeTask: (id: string) => boolean;
  /** Mekanı tamamlandı/iptal yapar; tamamlanırsa ilgili görevleri de tamamlar. */
  togglePlaceVisited: (placeId: string) => boolean;
  resetProgress: () => void;
  completedCount: number;
  totalCount: number;
  percent: number;
  points: number;
  /** Bu şehrin tüm görevleri bitti mi? */
  isTourComplete: boolean;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

// Sabit referans: her renderda yeni dizi uretmek memo bagimliliklarini bozar.
const EMPTY: string[] = [];

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { cityId, city } = useCity();
  const tasks = city.tasks;
  const totalCount = tasks.length;
  const [completedTaskIds, setTaskIds] = useState<string[]>([]);
  const [completedPlaceIds, setPlaceIds] = useState<string[]>([]);
  const [loadedCityId, setLoadedCityId] = useState<CityId | null>(null);

  // Render sırasında hesaplanır: efekt içinde bayrak indirmek, aynı commit'teki
  // diğer efektler için geç kalır ve şehir değişiminde bir kare bayat veri görünür.
  const loaded = loadedCityId === cityId;

  useEffect(() => {
    let active = true;
    void (async () => {
      const [storedTasks, storedPlaces] = await Promise.all([
        getCompletedTaskIds(cityId),
        getCompletedPlaceIds(cityId),
      ]);
      if (active) {
        setTaskIds(storedTasks);
        setPlaceIds(storedPlaces);
        setLoadedCityId(cityId);
      }
    })();
    return () => {
      active = false;
    };
  }, [cityId]);

  const persistTasks = useCallback(
    (ids: string[]) => {
      setTaskIds(ids);
      void setCompletedTaskIds(cityId, ids);
    },
    [cityId],
  );

  const persistPlaces = useCallback(
    (ids: string[]) => {
      setPlaceIds(ids);
      void setCompletedPlaceIds(cityId, ids);
    },
    [cityId],
  );

  // Sehir degistiginde `tasks` aninda yeni sehre gecer ama tamamlananlar bir sonraki
  // karede gelir. O ara karede eski sehrin id'lerini yeni sehrin toplamiyla saymamak
  // icin, yuklenene kadar ilerleme bos kabul edilir.
  const gorunenTasks = loaded ? completedTaskIds : EMPTY;
  const gorunenPlaces = loaded ? completedPlaceIds : EMPTY;

  const isTaskCompleted = useCallback(
    (id: string) => gorunenTasks.includes(id),
    [gorunenTasks],
  );

  const isPlaceCompleted = useCallback(
    (id: string) => gorunenPlaces.includes(id),
    [gorunenPlaces],
  );

  const toggleTask = useCallback(
    (id: string) => {
      if (!loaded) return false;
      persistTasks(
        completedTaskIds.includes(id)
          ? completedTaskIds.filter((x) => x !== id)
          : [...completedTaskIds, id],
      );
      return true;
    },
    [completedTaskIds, persistTasks, loaded],
  );

  const completeTask = useCallback(
    (id: string) => {
      if (!loaded) return false;
      if (!completedTaskIds.includes(id)) {
        persistTasks([...completedTaskIds, id]);
      }
      return true;
    },
    [completedTaskIds, persistTasks, loaded],
  );

  const togglePlaceVisited = useCallback(
    (placeId: string) => {
      if (!loaded) return false;
      const willComplete = !completedPlaceIds.includes(placeId);
      persistPlaces(
        willComplete
          ? [...completedPlaceIds, placeId]
          : completedPlaceIds.filter((x) => x !== placeId),
      );
      if (willComplete) {
        const relatedTaskIds = tasks.filter((t) => t.relatedPoiId === placeId).map((t) => t.id);
        const merged = Array.from(new Set([...completedTaskIds, ...relatedTaskIds]));
        // Uzunluk degil benzersiz sayi karsilastirilir: depoda tekrar eden id varsa
        // uzunluk esitligi yeni gorevi yutuyordu. Ikinci kosul o tekrarlari da temizler.
        const oncekiBenzersiz = new Set(completedTaskIds).size;
        if (merged.length !== oncekiBenzersiz || completedTaskIds.length !== oncekiBenzersiz) {
          persistTasks(merged);
        }
      }
      return true;
    },
    [completedPlaceIds, completedTaskIds, persistPlaces, persistTasks, tasks, loaded],
  );

  const resetProgress = useCallback(() => {
    setTaskIds([]);
    setPlaceIds([]);
    void clearStoredProgress(cityId);
  }, [cityId]);

  const value = useMemo<ProgressContextValue>(() => {
    // Depo guvenilir bir sinir degil: eski surumden kalan, yeniden adlandirilmis ya da
    // tekrar eden id'ler bulunabilir. Sayimi gorev listesinden turetmek hem bunlari eler
    // hem de benzersizligi garanti eder, boylece yuzde yapisal olarak 100'u asamaz.
    const tamamlananlar = tasks.filter((t) => gorunenTasks.includes(t.id));
    const completedCount = tamamlananlar.length;
    const points = tamamlananlar.reduce((sum, t) => sum + t.points, 0);
    const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
    return {
      loaded,
      completedTaskIds: gorunenTasks,
      completedPlaceIds: gorunenPlaces,
      isTaskCompleted,
      isPlaceCompleted,
      toggleTask,
      completeTask,
      togglePlaceVisited,
      resetProgress,
      completedCount,
      totalCount,
      percent,
      points,
      isTourComplete: loaded && totalCount > 0 && completedCount === totalCount,
    };
  }, [
    loaded,
    gorunenTasks,
    gorunenPlaces,
    isTaskCompleted,
    isPlaceCompleted,
    toggleTask,
    completeTask,
    togglePlaceVisited,
    resetProgress,
    tasks,
    totalCount,
  ]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress, ProgressProvider içinde kullanılmalıdır.');
  }
  return ctx;
}
