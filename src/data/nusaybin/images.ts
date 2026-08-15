import type { ImageSourcePropType } from 'react-native';

/**
 * Yerel olarak paketlenmiş Nusaybin mekan görselleri (Wikimedia Commons'tan indirildi).
 * Her dizinin ilk elemanı ana görsel, kalanlar galeridir ve sıraları
 * mekanın `gallery` künyeleriyle birebir eşleşir.
 */
export const nusaybinImages: Record<string, ImageSourcePropType[]> = {
  'mor-yakup-kilisesi': [
    require('../../../assets/images/places/nusaybin/mor-yakup.jpg'),
    require('../../../assets/images/places/nusaybin/mor-yakup-2.jpg'),
    require('../../../assets/images/places/nusaybin/mor-yakup-3.jpg'),
    require('../../../assets/images/places/nusaybin/mor-yakup-4.jpg'),
  ],
  'zeynel-abidin-camii': [
    require('../../../assets/images/places/nusaybin/zeynel-abidin.jpg'),
  ],
  'barsi-parki': [
    require('../../../assets/images/places/nusaybin/baris-parki.jpg'),
    require('../../../assets/images/places/nusaybin/baris-parki-2.jpg'),
    require('../../../assets/images/places/nusaybin/baris-parki-3.jpg'),
  ],
  'cagcag-deresi': [
    require('../../../assets/images/places/nusaybin/cagcag.jpg'),
  ],
  'kultur-inanc-parki': [
    require('../../../assets/images/places/nusaybin/kultur-inanc.jpg'),
  ],
  'kacakcilar-carsisi': [
    require('../../../assets/images/places/nusaybin/kacakcilar.jpg'),
  ],
  beyazsu: [
    require('../../../assets/images/places/nusaybin/beyazsu.jpg'),
    require('../../../assets/images/places/nusaybin/beyazsu-2.jpg'),
  ],
  'guzel-ticaret': [
    require('../../../assets/images/places/nusaybin/guzel-ticaret.jpg'),
  ],
};
