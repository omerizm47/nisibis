import tasksData from '@/data/tasks.json';
import type { TourTask } from '@/types';

const TASKS = tasksData as unknown as TourTask[];

export function getAllTasks(): TourTask[] {
  return TASKS;
}

export function getTaskById(id: string): TourTask | undefined {
  return TASKS.find((t) => t.id === id);
}

/** Bir mekana bağlı görevleri döndürür. */
export function getTasksForPlace(placeId: string): TourTask[] {
  return TASKS.filter((t) => t.relatedPoiId === placeId);
}

export function useTasks(): TourTask[] {
  return TASKS;
}
