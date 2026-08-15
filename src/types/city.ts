import type { ImageSourcePropType } from 'react-native';
import type { Place, PlaceSource } from './place';
import type { TourRoute } from './route';
import type { TourTask } from './task';

export type CityId = 'nusaybin' | 'mardin';

export interface CityRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

/**
 * Bir şehrin uygulamaya bağlanan her şeyi: veri kümeleri, harita açılışı,
 * hikâye anahtarı, amblem ve kaynak listesi.
 */
export interface City {
  id: CityId;
  /** Arayüzde görünen ad. Türkçe ekler her iki şehirde de aynı ('in / 'e). */
  name: string;
  /** Hikâye ekranının başlığındaki antik ad. */
  ancientName: string;
  region: CityRegion;
  places: Place[];
  routes: TourRoute[];
  tasks: TourTask[];
  /** Mekan id'sinden paketlenmiş görsellere. İlk eleman ana görsel, kalanlar galeri. */
  images: Record<string, ImageSourcePropType[]>;
  sources: PlaceSource[];
  /** Haritada kesikli çizgiyle bağlanan iki simge yapı. */
  signatureLink: [string, string] | null;
  emblem: 'nusaybin' | 'mardin';
}
