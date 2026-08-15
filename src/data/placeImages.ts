import type { ImageSourcePropType } from 'react-native';
import { getActiveCity } from './activeCity';

/** Bir mekan için görsel kaynağını döndürür: önce aktif şehrin yerel paketi, yoksa uzak URL. */
export function getPlaceImageSource(place: { id: string; image?: string }): ImageSourcePropType {
  return getActiveCity().images[place.id] ?? { uri: place.image ?? '' };
}
