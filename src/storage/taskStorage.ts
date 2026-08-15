import AsyncStorage from '@react-native-async-storage/async-storage';
import { LEGACY_PROGRESS_KEYS, progressKeys, STORAGE_KEYS } from '@/utils/constants';

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

export const getCompletedTaskIds = (cityId: string): Promise<string[]> =>
  getStringArray(progressKeys(cityId).completedTasks);

export const setCompletedTaskIds = (cityId: string, ids: string[]): Promise<void> =>
  setStringArray(progressKeys(cityId).completedTasks, ids);

export const getCompletedPlaceIds = (cityId: string): Promise<string[]> =>
  getStringArray(progressKeys(cityId).completedPlaces);

export const setCompletedPlaceIds = (cityId: string, ids: string[]): Promise<void> =>
  setStringArray(progressKeys(cityId).completedPlaces, ids);

/**
 * Tek şehirli sürümde biriken ilerlemeyi bir kez Nusaybin'e taşır.
 * Hedefte zaten veri varsa eski anahtara dokunulmadan bırakılır.
 */
export async function migrateLegacyProgress(legacyCityId: string): Promise<void> {
  try {
    const [legacyTasks, legacyPlaces] = await AsyncStorage.multiGet([
      LEGACY_PROGRESS_KEYS.completedTasks,
      LEGACY_PROGRESS_KEYS.completedPlaces,
    ]);
    const pairs: [string, string][] = [];
    const keys = progressKeys(legacyCityId);
    if (legacyTasks[1] && !(await AsyncStorage.getItem(keys.completedTasks))) {
      pairs.push([keys.completedTasks, legacyTasks[1]]);
    }
    if (legacyPlaces[1] && !(await AsyncStorage.getItem(keys.completedPlaces))) {
      pairs.push([keys.completedPlaces, legacyPlaces[1]]);
    }
    if (pairs.length) await AsyncStorage.multiSet(pairs);
    if (legacyTasks[1] || legacyPlaces[1]) {
      await AsyncStorage.multiRemove([
        LEGACY_PROGRESS_KEYS.completedTasks,
        LEGACY_PROGRESS_KEYS.completedPlaces,
      ]);
    }
  } catch {
    // Sessizce yoksay.
  }
}

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

/** Bir şehrin tamamlanan görev ve mekan ilerlemesini temizler. */
export async function clearProgress(cityId: string): Promise<void> {
  try {
    const keys = progressKeys(cityId);
    await AsyncStorage.multiRemove([keys.completedTasks, keys.completedPlaces]);
  } catch {
    // Sessizce yoksay.
  }
}

/** Seçili şehri okur. Henüz seçilmediyse null döner. */
export async function getStoredCity(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.city);
  } catch {
    return null;
  }
}

export async function setStoredCity(cityId: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.city, cityId);
  } catch {
    // Sessizce yoksay.
  }
}
