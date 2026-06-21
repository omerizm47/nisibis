import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type { PlaceCategory } from '@/types';
import { colors, getCategoryMeta, radius, spacing, typography } from '@/theme';
import { withAlpha } from '@/utils/color';
import { upperLocale } from '@/utils/text';
import { CategoryIcon } from './CategoryIcon';

interface CategoryBadgeProps {
  category: PlaceCategory;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
}

export function CategoryBadge({ category, style, compact = false }: CategoryBadgeProps) {
  const { t, i18n } = useTranslation();
  const meta = getCategoryMeta(category);

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: withAlpha(colors.text, 0.58),
          borderColor: withAlpha(meta.color, 0.55),
          paddingVertical: compact ? 3 : 5,
        },
        style,
      ]}
    >
      <CategoryIcon category={category} size={compact ? 12 : 14} color={meta.color} />
      {!compact && (
        <Text style={[styles.label, { color: meta.color }]}>{upperLocale(t(meta.labelKey), i18n.language)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  label: {
    ...typography.overline,
  },
});
