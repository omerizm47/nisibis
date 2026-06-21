/**
 * "Mezopotamya Premium" renk paleti.
 * Koyu taban + altın vurgu + Nusaybin/Mardin taş-toprak tonları.
 */
export const colors = {
  // Yüzeyler (kireçtaşı / kum)
  background: '#ECE0CD',
  backgroundElevated: '#F3EAD9',
  card: '#FBF6EC',
  cardAlt: '#F1E7D4',
  cardMuted: '#EEE3CE',

  // Vurgu (gün ışığı / kil / toprak)
  primary: '#C0682B',
  primaryDark: '#8A491E',
  secondary: '#7A3E1D',
  sand: '#CDA063',
  clay: '#B0532A',
  copper: '#A8632A',
  pomegranate: '#9E2B25',
  indigo: '#2E4374',
  turquoise: '#2C8A82',
  limestone: '#E7D7C3',

  // Metin (ceviz / espresso)
  text: '#3B2A18',
  mutedText: '#6E5942',
  subtleText: '#856E4E',
  onPrimary: '#FFF7EB',

  // Çizgi / kenarlık
  border: '#E0D0B6',
  borderStrong: '#C7AE8C',

  // Durum
  success: '#5E8A3C',
  danger: '#B23A2E',
  info: '#2C8A82',

  // Yardımcı
  overlay: 'rgba(43, 30, 18, 0.55)',
  overlaySoft: 'rgba(43, 30, 18, 0.32)',
  scrim: 'rgba(43, 30, 18, 0.5)',
  mapBackground: '#E7D9C0',
  transparent: 'transparent',
} as const;

/** Sık kullanılan degrade setleri (expo-linear-gradient için). */
export const gradients = {
  gold: ['#D98A3D', '#AE5320'] as const,
  nightStone: ['#E7D7C3', '#D5BD99'] as const,
  imageScrim: ['transparent', 'rgba(43,30,18,0.10)', 'rgba(43,30,18,0.90)'] as const,
  hero: ['#F4E8CF', '#E7CFA1'] as const,
};

export type AppColors = typeof colors;
