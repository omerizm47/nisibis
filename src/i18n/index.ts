import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { STORAGE_KEYS, SUPPORTED_LANGUAGES, type AppLanguage } from '@/utils/constants';
import ar from './ar.json';
import en from './en.json';
import tr from './tr.json';

function isSupported(code: string | null | undefined): code is AppLanguage {
  return !!code && (SUPPORTED_LANGUAGES as readonly string[]).includes(code);
}

function getDeviceLanguage(): AppLanguage {
  // MVP: uygulama Türkçe başlar (İngilizce/Arapça sonra eklenecek).
  return 'tr';
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      tr: { translation: tr },
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: getDeviceLanguage(),
    fallbackLng: 'tr',
    interpolation: { escapeValue: false },
    returnNull: false,
  });
}

/** Cihazda kayıtlı dil tercihini yükler (varsa). */
export async function loadStoredLanguage(): Promise<void> {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEYS.language);
    if (isSupported(saved) && saved !== i18n.language) {
      await i18n.changeLanguage(saved);
    }
  } catch {
    // Sessizce yoksay.
  }
}

/** Dili değiştirir ve tercihi cihazda saklar. */
export async function setAppLanguage(language: AppLanguage): Promise<void> {
  await i18n.changeLanguage(language);
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.language, language);
  } catch {
    // Sessizce yoksay.
  }
}

export default i18n;
