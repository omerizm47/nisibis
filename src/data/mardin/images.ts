import type { ImageSourcePropType } from 'react-native';

/**
 * Yerel olarak paketlenmiş Mardin mekan görselleri (Wikimedia Commons'tan indirildi).
 * Uzak hotlink engellendiği için görseller cihazda bundle'lanır.
 * Atıflar için bkz. her mekanın `imageCredit` / `imageLicense` / `imageSourceUrl` alanları.
 */
export const mardinImages: Record<string, ImageSourcePropType> = {
  'mardin-ulu-camii': require('../../../assets/images/places/mardin/ulu-cami.jpg'),
  'zinciriye-medresesi': require('../../../assets/images/places/mardin/zinciriye.jpg'),
  'kasimiye-medresesi': require('../../../assets/images/places/mardin/kasimiye.jpg'),
  'mardin-muzesi': require('../../../assets/images/places/mardin/mardin-muzesi.jpg'),
  'sakip-sabanci-kent-muzesi': require('../../../assets/images/places/mardin/sabanci-kent-muzesi.jpg'),
  'mardin-kalesi': require('../../../assets/images/places/mardin/mardin-kalesi.jpg'),
  'kirklar-kilisesi': require('../../../assets/images/places/mardin/kirklar-kilisesi.jpg'),
  'sehidiye-medresesi': require('../../../assets/images/places/mardin/sehidiye.jpg'),
  'latifiye-camii': require('../../../assets/images/places/mardin/latifiye.jpg'),
  'revakli-carsi': require('../../../assets/images/places/mardin/revakli-carsi.jpg'),
  abbaralar: require('../../../assets/images/places/mardin/abbara.jpg'),
  'cumhuriyet-meydani': require('../../../assets/images/places/mardin/cumhuriyet-meydani.jpg'),
  'deyrulzafaran-manastiri': require('../../../assets/images/places/mardin/deyrulzafaran.jpg'),
  'dara-antik-kenti': require('../../../assets/images/places/mardin/dara.jpg'),
  'kiziltepe-ulu-camii': require('../../../assets/images/places/mardin/kiziltepe-ulu-camii.jpg'),
};
