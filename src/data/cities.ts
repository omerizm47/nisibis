import type { City, CityId, Place, TourRoute, TourTask } from '@/types';
import { mardinImages } from './mardin/images';
import mardinPlaces from './mardin/places.json';
import mardinRoutes from './mardin/routes.json';
import mardinTasks from './mardin/tasks.json';
import { nusaybinImages } from './nusaybin/images';
import nusaybinPlaces from './nusaybin/places.json';
import nusaybinRoutes from './nusaybin/routes.json';
import nusaybinTasks from './nusaybin/tasks.json';

export const CITY_IDS: readonly CityId[] = ['nusaybin', 'mardin'] as const;

export const DEFAULT_CITY_ID: CityId = 'nusaybin';

export const CITIES: Record<CityId, City> = {
  nusaybin: {
    id: 'nusaybin',
    name: 'Nusaybin',
    ancientName: 'NISIBIS',
    region: {
      latitude: 37.0725,
      longitude: 41.2152,
      latitudeDelta: 0.017,
      longitudeDelta: 0.012,
    },
    places: nusaybinPlaces as unknown as Place[],
    routes: nusaybinRoutes as unknown as TourRoute[],
    tasks: nusaybinTasks as unknown as TourTask[],
    images: nusaybinImages,
    sources: [
      { title: 'Türkiye Kültür Portalı', url: 'https://www.kulturportali.gov.tr/turkiye/mardin' },
      { title: 'Mardin İl Kültür ve Turizm Müdürlüğü', url: 'https://mardin.ktb.gov.tr' },
      { title: 'TDV İslam Ansiklopedisi, Nusaybin', url: 'https://islamansiklopedisi.org.tr/nusaybin' },
      { title: 'Vikipedi, Nusaybin', url: 'https://tr.wikipedia.org/wiki/Nusaybin' },
      { title: 'Wikimedia Commons, Nusaybin', url: 'https://commons.wikimedia.org/wiki/Category:Nusaybin' },
    ],
    signatureLink: ['mor-yakup-kilisesi', 'zeynel-abidin-camii'],
    emblem: 'nusaybin',
  },
  mardin: {
    id: 'mardin',
    name: 'Mardin',
    ancientName: 'MARIDIN',
    // Batıda Kasımiye, doğuda Kent Müzesi, kuzeyde kale sırtı kadraja girsin diye geniş.
    region: {
      latitude: 37.3133,
      longitude: 40.739,
      latitudeDelta: 0.022,
      longitudeDelta: 0.045,
    },
    places: mardinPlaces as unknown as Place[],
    routes: mardinRoutes as unknown as TourRoute[],
    tasks: mardinTasks as unknown as TourTask[],
    images: mardinImages,
    sources: [
      { title: 'Türkiye Kültür Portalı', url: 'https://www.kulturportali.gov.tr/turkiye/mardin' },
      { title: 'Mardin İl Kültür ve Turizm Müdürlüğü', url: 'https://mardin.ktb.gov.tr' },
      { title: 'Mardin Müzesi, T.C. Kültür ve Turizm Bakanlığı', url: 'https://muze.gov.tr/muze-detay?SectionId=MRD01&DistId=MRK' },
      { title: 'Mardin Cultural Landscape, UNESCO Geçici Listesi', url: 'https://whc.unesco.org/en/tentativelists/1406/' },
      { title: 'Vikipedi, Mardin', url: 'https://tr.wikipedia.org/wiki/Mardin' },
      { title: 'Wikimedia Commons, Mardin', url: 'https://commons.wikimedia.org/wiki/Category:Mardin' },
    ],
    signatureLink: ['mardin-ulu-camii', 'kirklar-kilisesi'],
    emblem: 'mardin',
  },
};

export function isCityId(value: string | null | undefined): value is CityId {
  return !!value && (CITY_IDS as readonly string[]).includes(value);
}

/** Aktif şehir dışındaki ilk şehir. Çapraz öneri kartı bunu kullanır. */
export function getOtherCity(cityId: CityId): City {
  const other = CITY_IDS.find((id) => id !== cityId) ?? DEFAULT_CITY_ID;
  return CITIES[other];
}
