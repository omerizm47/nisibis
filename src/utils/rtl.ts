import { I18nManager, Platform } from 'react-native';

/**
 * Geçerli dil/yapı için sağdan-sola (RTL) düzen aktif mi?
 *
 * Web'de Arapça seçildiğinde kök `dir="rtl"` ile flex/metin düzeni otomatik
 * çevrilir; bu yardımcı, otomatik çevrilmeyen öğeler için kullanılır
 * (geri butonunun konumu, yön ikonları gibi). Native'de `I18nManager` esas alınır.
 */
export function isRtl(language?: string): boolean {
  if (Platform.OS === 'web') {
    return (language ?? '').split('-')[0] === 'ar';
  }
  return I18nManager.isRTL;
}
