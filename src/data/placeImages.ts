import type { ImageSourcePropType } from 'react-native';

/**
 * Yerel olarak paketlenmiş mekan görselleri (Wikimedia Commons'tan indirildi).
 * Uzak hotlink engellendiği için görseller cihazda bundle'lanır.
 * Atıflar için bkz. her mekanın `imageCredit` / `imageSourceUrl` alanları.
 */
export const placeImages: Record<string, ImageSourcePropType> = {
  'mor-yakup-kilisesi': require('../../assets/images/places/mor-yakup.jpg'),
  'zeynel-abidin-camii': require('../../assets/images/places/zeynel-abidin.jpg'),
  'barsi-parki': require('../../assets/images/places/baris-parki.jpg'),
  'cagcag-deresi': require('../../assets/images/places/cagcag.jpg'),
  'kultur-inanc-parki': require('../../assets/images/places/kultur-inanc.jpg'),
  'kacakcilar-carsisi': require('../../assets/images/places/kacakcilar.jpg'),
  'guzel-ticaret': require('../../assets/images/places/guzel-ticaret.jpg'),
  beyazsu: require('../../assets/images/places/beyazsu.jpg'),
};

/** Bir mekan için görsel kaynağını döndürür: önce yerel, yoksa uzak URL. */
export function getPlaceImageSource(place: { id: string; image?: string }): ImageSourcePropType {
  return placeImages[place.id] ?? { uri: place.image ?? '' };
}
