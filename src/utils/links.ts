import { Linking, Platform, Share } from 'react-native';
import type { LatLng } from './distance';

/** Bir koordinatı Google Haritalar arama bağlantısına çevirir (paylaşım için uygundur). */
export function mapsUrl(coord: LatLng): string {
  return `https://www.google.com/maps/search/?api=1&query=${coord.latitude},${coord.longitude}`;
}

/** Yürüyüş yol tarifi için Google Haritalar evrensel bağlantısı (web yedeği). */
export function directionsUrl(coord: LatLng): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${coord.latitude},${coord.longitude}&travelmode=walking`;
}

/**
 * Cihazın varsayılan harita uygulamasında yürüyüş yol tarifini açar.
 * iOS'ta Apple Haritalar denenir; başarısız olursa veya diğer platformlarda
 * Google Haritalar evrensel bağlantısına düşülür.
 */
export async function openDirections(coord: LatLng): Promise<void> {
  const fallback = directionsUrl(coord);
  const latlng = `${coord.latitude},${coord.longitude}`;
  const primary = Platform.OS === 'ios' ? `http://maps.apple.com/?daddr=${latlng}&dirflg=w` : fallback;
  try {
    if (primary !== fallback) {
      const ok = await Linking.canOpenURL(primary);
      await Linking.openURL(ok ? primary : fallback);
    } else {
      await Linking.openURL(fallback);
    }
  } catch {
    try {
      await Linking.openURL(fallback);
    } catch {
      // Açılamazsa sessizce yok say.
    }
  }
}

/** Sistem paylaşım sayfasını açar. İptal/hata durumunda sessizce yok sayılır. */
export async function shareContent(message: string, title?: string): Promise<void> {
  try {
    await Share.share({ message, title });
  } catch {
    // Kullanıcı iptal etti veya desteklenmiyor.
  }
}
