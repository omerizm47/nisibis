import { Platform, type ViewStyle } from 'react-native';

/** Tutarlı boşluk, köşe yarıçapı ve gölge ölçekleri. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  x2l: 32,
  x3l: 48,
  x4l: 64,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  x2l: 28,
  pill: 999,
} as const;

/**
 * Platforma göre gölge ön ayarları.
 * Web'de `boxShadow` (RNW artık shadow* proplarını "deprecated" sayar),
 * iOS/Android'de shadow* + elevation kullanılır.
 */
export const shadow = {
  sm: Platform.select<ViewStyle>({
    web: { boxShadow: '0px 2px 6px rgba(74, 52, 28, 0.10)' },
    default: {
      shadowColor: '#4A341C',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 2,
    },
  }),
  md: Platform.select<ViewStyle>({
    web: { boxShadow: '0px 8px 20px rgba(74, 52, 28, 0.14)' },
    default: {
      shadowColor: '#4A341C',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.14,
      shadowRadius: 18,
      elevation: 6,
    },
  }),
  gold: Platform.select<ViewStyle>({
    web: { boxShadow: '0px 8px 20px rgba(176, 83, 30, 0.30)' },
    default: {
      shadowColor: '#B0531E',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 18,
      elevation: 8,
    },
  }),
};
