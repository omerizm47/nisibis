import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { useCity } from '@/hooks';
import { colors, radius, spacing, typography } from '@/theme';
import { withAlpha } from '@/utils/color';
import { hapticSelection } from '@/utils/haptics';

/** Aktif şehri gösterir; dokununca diğer şehre geçer. */
export function CityChip({ style }: { style?: StyleProp<ViewStyle> }) {
  const { t } = useTranslation();
  const { city, otherCity, setCity } = useCity();
  return (
    <Pressable
      onPress={() => {
        hapticSelection();
        setCity(otherCity.id);
      }}
      accessibilityRole="button"
      accessibilityLabel={t('city.switchTo', { city: otherCity.name })}
      style={({ pressed }) => [styles.chip, pressed && styles.pressed, style]}
    >
      <MaterialCommunityIcons name="swap-horizontal" size={14} color={colors.primary} />
      <Text style={styles.text}>{city.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: withAlpha(colors.background, 0.7),
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: withAlpha(colors.primary, 0.4),
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    ...typography.label,
    color: colors.primary,
  },
});
