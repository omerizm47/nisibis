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
import { useCity } from './useCity';

export interface ProgressContextValue {
  loaded: boolean;
  completedTaskIds: string[];
  completedPlaceIds: string[];
  isTaskCompleted: (id: string) => boolean;
  isPlaceCompleted: (id: string) => boolean;
  toggleTask: (id: string) => void;
  completeTask: (id: string) => void;
  /** Mekanı tamamlandı/iptal yapar; tamamlanırsa ilgili görevleri de tamamlar. */
  togglePlaceVisited: (placeId: string) => void;
  resetProgress: () => void;
  completedCount: number;
  totalCount: number;
  percent: number;
  points: number;
  /** Bu şehrin tüm görevleri bitti mi? */
  isTourComplete: boolean;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { cityId, city } = useCity();
  const tasks = city.tasks;
  const totalCount = tasks.length;
  const [completedTaskIds, setTaskIds] = useState<string[]>([]);
  const [completedPlaceIds, setPlaceIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    setLoaded(false);
    void (async () => {
      const [storedTasks, storedPlaces] = await Promise.all([
        getCompletedTaskIds(cityId),
        getCompletedPlaceIds(cityId),
      ]);
      if (active) {
        setTaskIds(storedTasks);
        setPlaceIds(storedPlaces);
        setLoaded(true);
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

  const isTaskCompleted = useCallback(
    (id: string) => completedTaskIds.includes(id),
    [completedTaskIds],
  );

  const isPlaceCompleted = useCallback(
    (id: string) => completedPlaceIds.includes(id),
    [completedPlaceIds],
  );

  const toggleTask = useCallback(
    (id: string) => {
      persistTasks(
        completedTaskIds.includes(id)
          ? completedTaskIds.filter((x) => x !== id)
          : [...completedTaskIds, id],
      );
    },
    [completedTaskIds, persistTasks],
  );

  const completeTask = useCallback(
    (id: string) => {
      if (!completedTaskIds.includes(id)) {
        persistTasks([...completedTaskIds, id]);
      }
    },
    [completedTaskIds, persistTasks],
  );

  const togglePlaceVisited = useCallback(
    (placeId: string) => {
      const willComplete = !completedPlaceIds.includes(placeId);
      persistPlaces(
        willComplete
          ? [...completedPlaceIds, placeId]
          : completedPlaceIds.filter((x) => x !== placeId),
      );
      if (willComplete) {
        const relatedTaskIds = tasks.filter((t) => t.relatedPoiId === placeId).map((t) => t.id);
        const merged = Array.from(new Set([...completedTaskIds, ...relatedTaskIds]));
        if (merged.length !== completedTaskIds.length) {
          persistTasks(merged);
        }
      }
    },
    [completedPlaceIds, completedTaskIds, persistPlaces, persistTasks, tasks],
  );

  const resetProgress = useCallback(() => {
    setTaskIds([]);
    setPlaceIds([]);
    void clearStoredProgress(cityId);
  }, [cityId]);

  const value = useMemo<ProgressContextValue>(() => {
    const completedCount = completedTaskIds.length;
    const points = tasks
      .filter((t) => completedTaskIds.includes(t.id))
      .reduce((sum, t) => sum + t.points, 0);
    const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
    return {
      loaded,
      completedTaskIds,
      completedPlaceIds,
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
      isTourComplete: totalCount > 0 && completedCount === totalCount,
    };
  }, [
    loaded,
    completedTaskIds,
    completedPlaceIds,
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
