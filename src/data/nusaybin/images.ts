import type { ImageSourcePropType } from 'react-native';

/**
 * Yerel olarak paketlenmiş Nusaybin mekan görselleri (Wikimedia Commons'tan indirildi).
 * Uzak hotlink engellendiği için görseller cihazda bundle'lanır.
 * Atıflar için bkz. her mekanın `imageCredit` / `imageSourceUrl` alanları.
 */
export const nusaybinImages: Record<string, ImageSourcePropType> = {
  'mor-yakup-kilisesi': require('../../../assets/images/places/nusaybin/mor-yakup.jpg'),
  'zeynel-abidin-camii': require('../../../assets/images/places/nusaybin/zeynel-abidin.jpg'),
  'barsi-parki': require('../../../assets/images/places/nusaybin/baris-parki.jpg'),
  'cagcag-deresi': require('../../../assets/images/places/nusaybin/cagcag.jpg'),
  'kultur-inanc-parki': require('../../../assets/images/places/nusaybin/kultur-inanc.jpg'),
  'kacakcilar-carsisi': require('../../../assets/images/places/nusaybin/kacakcilar.jpg'),
  'guzel-ticaret': require('../../../assets/images/places/nusaybin/guzel-ticaret.jpg'),
  beyazsu: require('../../../assets/images/places/nusaybin/beyazsu.jpg'),
};
