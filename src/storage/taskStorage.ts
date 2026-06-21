import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/utils/constants';

async function getStringArray(key: string): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === 'string')
      : [];
  } catch {
    return [];
  }
}

async function setStringArray(key: string, value: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Sessizce yoksay.
  }
}

export const getCompletedTaskIds = (): Promise<string[]> =>
  getStringArray(STORAGE_KEYS.completedTasks);

export const setCompletedTaskIds = (ids: string[]): Promise<void> =>
  setStringArray(STORAGE_KEYS.completedTasks, ids);

export const getCompletedPlaceIds = (): Promise<string[]> =>
  getStringArray(STORAGE_KEYS.completedPlaces);

export const setCompletedPlaceIds = (ids: string[]): Promise<void> =>
  setStringArray(STORAGE_KEYS.completedPlaces, ids);

export async function getOnboardingComplete(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(STORAGE_KEYS.onboardingComplete)) === 'true';
  } catch {
    return false;
  }
}

export async function setOnboardingComplete(value: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.onboardingComplete, value ? 'true' : 'false');
  } catch {
    // Sessizce yoksay.
  }
}

/** Tamamlanan görev ve mekan ilerlemesini temizler. */
export async function clearProgress(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.completedTasks,
      STORAGE_KEYS.completedPlaces,
    ]);
  } catch {
    // Sessizce yoksay.
  }
}
