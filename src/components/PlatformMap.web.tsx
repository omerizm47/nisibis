import { forwardRef, useImperativeHandle, type ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '@/theme';

type StubProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Web fallback'i: react-native-maps web'de çalışmadığından, harita yerine
 * zarif bir bilgilendirme kartı gösterilir. Uygulamanın diğer tüm ekranları
 * (Keşfet, Rotalar, Kontrol Listesi, mekân detayları) web'de tam çalışır.
 */
const MapView = forwardRef<unknown, StubProps>(({ children, style }, ref) => {
  useImperativeHandle(ref, () => ({
    animateToRegion: () => {},
    animateCamera: () => {},
    fitToCoordinates: () => {},
  }));

  return (
    <View style={[styles.fallback, style]}>
      <View style={styles.badge}>
        <MaterialCommunityIcons name="map-search-outline" size={46} color={colors.primary} />
      </View>
      <Text style={styles.title}>Harita mobil uygulamada</Text>
      <Text style={styles.subtitle}>
        İnteraktif keşif haritası yalnızca telefon uygulamasında görünür. Web önizlemesinde
        Keşfet, Rotalar, Kontrol Listesi ve tüm mekân detaylarını gezebilirsin.
      </Text>
      <View style={styles.hidden}>{children}</View>
    </View>
  );
});

MapView.displayName = 'WebMapFallback';
export default MapView;

export const Marker = (_props: StubProps): null => null;
export const Polyline = (_props: StubProps): null => null;
export const UrlTile = (_props: StubProps): null => null;
export const Callout = ({ children }: StubProps) => <>{children}</>;
export const PROVIDER_DEFAULT = undefined;
export const PROVIDER_GOOGLE = 'google';

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },
  badge: {
    width: 92,
    height: 92,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.mutedText,
    textAlign: 'center',
    maxWidth: 380,
  },
  hidden: { width: 0, height: 0, overflow: 'hidden' },
});
