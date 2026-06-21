import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import tasksData from '@/data/tasks.json';
import type { TourTask } from '@/types';
import {
  clearProgress as clearStoredProgress,
  getCompletedPlaceIds,
  getCompletedTaskIds,
  setCompletedPlaceIds,
  setCompletedTaskIds,
} from '@/storage/taskStorage';

const TASKS = tasksData as unknown as TourTask[];
const TOTAL_TASKS = TASKS.length;

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
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completedTaskIds, setTaskIds] = useState<string[]>([]);
  const [completedPlaceIds, setPlaceIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    void (async () => {
      const [tasks, places] = await Promise.all([
        getCompletedTaskIds(),
        getCompletedPlaceIds(),
      ]);
      if (active) {
        setTaskIds(tasks);
        setPlaceIds(places);
        setLoaded(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const persistTasks = useCallback((ids: string[]) => {
    setTaskIds(ids);
    void setCompletedTaskIds(ids);
  }, []);

  const persistPlaces = useCallback((ids: string[]) => {
    setPlaceIds(ids);
    void setCompletedPlaceIds(ids);
  }, []);

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
        const relatedTaskIds = TASKS.filter((t) => t.relatedPoiId === placeId).map((t) => t.id);
        const merged = Array.from(new Set([...completedTaskIds, ...relatedTaskIds]));
        if (merged.length !== completedTaskIds.length) {
          persistTasks(merged);
        }
      }
    },
    [completedPlaceIds, completedTaskIds, persistPlaces, persistTasks],
  );

  const resetProgress = useCallback(() => {
    setTaskIds([]);
    setPlaceIds([]);
    void clearStoredProgress();
  }, []);

  const value = useMemo<ProgressContextValue>(() => {
    const completedCount = completedTaskIds.length;
    const points = TASKS.filter((t) => completedTaskIds.includes(t.id)).reduce(
      (sum, t) => sum + t.points,
      0,
    );
    const percent = TOTAL_TASKS === 0 ? 0 : Math.round((completedCount / TOTAL_TASKS) * 100);
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
      totalCount: TOTAL_TASKS,
      percent,
      points,
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
