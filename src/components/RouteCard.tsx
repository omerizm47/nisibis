import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type { TourRoute } from '@/types';
import { colors, radius, shadow, spacing, typography } from '@/theme';
import { withAlpha } from '@/utils/color';
import type { MciName } from '@/utils/icons';
import { StoneLattice } from './Patterns';
import { PressableScale } from './PressableScale';

interface RouteCardProps {
  route: TourRoute;
  onPress: () => void;
  completedStops?: number;
  style?: StyleProp<ViewStyle>;
}

function Meta({ icon, text }: { icon: MciName; text: string }) {
  return (
    <View style={styles.metaItem}>
      <MaterialCommunityIcons name={icon} size={14} color={colors.subtleText} />
      <Text style={styles.metaText}>{text}</Text>
    </View>
  );
}

export function RouteCard({ route, onPress, completedStops = 0, style }: RouteCardProps) {
  const { t } = useTranslation();
  const total = route.poiIds.length;
  const pct = total ? Math.round((completedStops / total) * 100) : 0;

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.card, shadow.md, style]}
    >
      <StoneLattice patternId={`route-lattice-${route.id}`} color={colors.copper} opacity={0.07} tile={32} />
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="map-marker-path" size={20} color={colors.primary} />
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {route.title}
        </Text>
      </View>
      <Text style={styles.desc} numberOfLines={2}>
        {route.description}
      </Text>
      <View style={styles.metaRow}>
        <Meta icon="clock-outline" text={route.estimatedDuration} />
        <Meta icon="map-marker-multiple-outline" text={t('routes.stops', { count: total })} />
        <Meta icon="chart-line-variant" text={t(`routes.difficulty_${route.difficulty}`)} />
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.progressLabel}>
        {t('routes.completedStops', { completed: completedStops, total })}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.92,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: withAlpha(colors.copper, 0.5),
  },
  title: {
    ...typography.title,
    color: colors.text,
    flex: 1,
  },
  desc: {
    ...typography.body,
    color: colors.mutedText,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...typography.caption,
    color: colors.subtleText,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.cardAlt,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  progressLabel: {
    ...typography.caption,
    color: colors.subtleText,
  },
});
