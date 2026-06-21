/**
 * Platforma duyarlı harita modülü.
 * Yerel (iOS / Android): react-native-maps'i olduğu gibi yeniden dışa aktarır.
 * Web: Metro otomatik olarak PlatformMap.web.tsx dosyasını kullanır
 * (react-native-maps web platformunu desteklemez).
 */
export { default } from 'react-native-maps';
export {
  Callout,
  Marker,
  Polyline,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  UrlTile,
} from 'react-native-maps';
