import { getActiveCity } from '@/data/activeCity';
import type { TourTask } from '@/types';

export function getAllTasks(): TourTask[] {
  return getActiveCity().tasks;
}

export function getTaskById(id: string): TourTask | undefined {
  return getAllTasks().find((t) => t.id === id);
}

/** Bir mekana bağlı görevleri döndürür. */
export function getTasksForPlace(placeId: string): TourTask[] {
  return getAllTasks().filter((t) => t.relatedPoiId === placeId);
}

export function useTasks(): TourTask[] {
  return getAllTasks();
}
