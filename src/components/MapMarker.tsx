import type { ImageRequireSource } from 'react-native';
import type { PlaceCategory } from '@/types';

/** Önceden üretilmiş PNG marker görselleri — react-native-maps <Marker image> ile native çizilir (custom View kırpma/tofu sorunları yaşanmaz). */
const markerImages: Record<PlaceCategory, ImageRequireSource> = {
  tarihi: require('../../assets/images/markers/tarihi.png'),
  'inanc-kultur': require('../../assets/images/markers/inanc-kultur.png'),
  carsi: require('../../assets/images/markers/carsi.png'),
  fotograf: require('../../assets/images/markers/fotograf.png'),
  'yemek-icecek': require('../../assets/images/markers/yemek-icecek.png'),
  park: require('../../assets/images/markers/park.png'),
  'yerel-deneyim': require('../../assets/images/markers/yerel-deneyim.png'),
};

const completedImage: ImageRequireSource = require('../../assets/images/markers/completed.png');

/** Kullanıcı konumu ("buradasın") nokta marker'ı — PNG, custom View kullanmaz. */
export const userMarkerImage: ImageRequireSource = require('../../assets/images/markers/user.png');

export function getMarkerImageSource(category: PlaceCategory, completed = false): ImageRequireSource {
  return completed ? completedImage : (markerImages[category] ?? markerImages.tarihi);
}
