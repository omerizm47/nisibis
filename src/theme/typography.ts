/**
 * Tipografi sistemi.
 * Başlıklar: Fraunces (miras hissi veren zarif serif).
 * Gövde: Inter (temiz, okunaklı sans-serif).
 * Fontlar `@expo-google-fonts/fraunces` ve `@expo-google-fonts/inter` ile yüklenir
 * (bkz. app/_layout.tsx).
 */
export const fontFamily = {
  display: 'Fraunces_600SemiBold',
  displayBold: 'Fraunces_700Bold',
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const fontSize = {
  xs: 12,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  x2l: 24,
  x3l: 30,
  x4l: 36,
} as const;

/** Hazır metin stilleri. StyleSheet içinde doğrudan kullanılabilir. */
export const typography = {
  hero: { fontFamily: fontFamily.displayBold, fontSize: 34, lineHeight: 40 },
  h1: { fontFamily: fontFamily.display, fontSize: 28, lineHeight: 34 },
  h2: { fontFamily: fontFamily.display, fontSize: 22, lineHeight: 28 },
  title: { fontFamily: fontFamily.semibold, fontSize: 18, lineHeight: 24 },
  subtitle: { fontFamily: fontFamily.medium, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 23 },
  bodyMedium: { fontFamily: fontFamily.medium, fontSize: 15, lineHeight: 23 },
  label: { fontFamily: fontFamily.semibold, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 16 },
  button: { fontFamily: fontFamily.semibold, fontSize: 16, lineHeight: 20 },
  overline: { fontFamily: fontFamily.semibold, fontSize: 11, lineHeight: 14, letterSpacing: 1.2 },
} as const;
