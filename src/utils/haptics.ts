import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Merkezî dokunsal geri bildirim yardımcıları. Yalnızca native'de çalışır;
 * web'de sessizce yok sayılır. Tüm uygulamada tutarlı his için kullanılır.
 */
const nativeOnly = Platform.OS !== 'web';

/** Seçim değişimi (filtre/sekme/dil) için ince geri bildirim. */
export function hapticSelection(): void {
  if (nativeOnly) void Haptics.selectionAsync();
}

/** Dokunma/onay için hafif darbe. */
export function hapticLight(): void {
  if (nativeOnly) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

/** Daha belirgin bir etkileşim için orta darbe. */
export function hapticMedium(): void {
  if (nativeOnly) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

/** Görev/tamamlama başarısı için bildirim geri bildirimi. */
export function hapticSuccess(): void {
  if (nativeOnly) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
