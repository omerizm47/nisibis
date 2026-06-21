import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, shadow, spacing, typography } from '@/theme';
import { ProgressRing } from './ProgressRing';

interface ProgressCardProps {
  percent: number;
  completedCount: number;
  totalCount: number;
  points?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ProgressCard({
  percent,
  completedCount,
  totalCount,
  points,
  onPress,
  style,
}: ProgressCardProps) {
  const { t } = useTranslation();

  const inner = (
    <>
      <ProgressRing percent={percent} size={68} strokeWidth={7}>
        <Text style={styles.percent}>{percent}%</Text>
      </ProgressRing>
      <View style={styles.texts}>
        <Text style={styles.title}>{t('progress.tourProgress')}</Text>
        <Text style={styles.subtitle}>
          {t('progress.completedOfTotal', { completed: completedCount, total: totalCount })}
          {points != null ? ` · ${t('checklist.points', { points })}` : ''}
        </Text>
        <Text style={styles.hint}>{t('progress.keepExploring')}</Text>
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, shadow.md, pressed && styles.pressed, style]}
      >
        {inner}
      </Pressable>
    );
  }

  return <View style={[styles.card, shadow.md, style]}>{inner}</View>;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  pressed: {
    opacity: 0.92,
  },
  percent: {
    ...typography.label,
    color: colors.text,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
  hint: {
    ...typography.caption,
    color: colors.subtleText,
  },
});
