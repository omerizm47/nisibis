import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type { Place } from '@/types';
import { getPlaceImageSource } from '@/data/placeImages';
import { colors, gradients, radius, shadow, spacing, typography } from '@/theme';
import { placeHasMapLocation } from '@/utils/map';
import { ArchFrame } from './ArchFrame';
import { CategoryBadge } from './CategoryBadge';
import { PressableScale } from './PressableScale';
import { RemoteImage } from './RemoteImage';

interface PlaceCardProps {
  place: Place;
  onPress: () => void;
  variant?: 'list' | 'featured';
  completed?: boolean;
  distanceLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function PlaceCard({
  place,
  onPress,
  variant = 'list',
  completed = false,
  distanceLabel,
  style,
}: PlaceCardProps) {
  const { t } = useTranslation();
  const featured = variant === 'featured';
  const showApprox = !place.coordinatesVerified && placeHasMapLocation(place);

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.card, featured ? styles.featuredCard : styles.listCard, shadow.md, style]}
    >
      <View style={featured ? styles.featuredImage : styles.listImage}>
        <ArchFrame archColor={colors.card} archHeight={26} style={StyleSheet.absoluteFill}>
          <RemoteImage source={getPlaceImageSource(place)} style={StyleSheet.absoluteFill} />
          <LinearGradient colors={gradients.imageScrim} style={StyleSheet.absoluteFill} />
        </ArchFrame>
        <View style={styles.badgeRow}>
          <CategoryBadge category={place.category} />
        </View>
        {completed ? (
          <View style={styles.completedBadge}>
            <MaterialCommunityIcons name="check-bold" size={14} color={colors.onPrimary} />
          </View>
        ) : null}
        {featured ? (
          <View style={styles.overlayTitleWrap}>
            <Text style={styles.overlayTitle} numberOfLines={2}>
              {place.name}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        {!featured ? (
          <Text style={styles.title} numberOfLines={2}>
            {place.name}
          </Text>
        ) : null}
        <Text style={styles.desc} numberOfLines={2}>
          {place.shortDescription}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="clock-outline" size={14} color={colors.subtleText} />
            <Text style={styles.metaText}>
              {t('common.minutes', { count: place.estimatedVisitMinutes })}
            </Text>
          </View>
          {distanceLabel ? (
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="map-marker-outline" size={14} color={colors.subtleText} />
              <Text style={styles.metaText}>{distanceLabel}</Text>
            </View>
          ) : null}
          {showApprox ? (
            <View style={styles.metaItem}>
              <MaterialCommunityIcons
                name="map-marker-question-outline"
                size={14}
                color={colors.subtleText}
              />
              <Text style={styles.metaText}>{t('common.approxLocation')}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  listCard: {
    width: '100%',
  },
  featuredCard: {
    width: 264,
  },
  pressed: {
    opacity: 0.92,
  },
  listImage: {
    height: 168,
  },
  featuredImage: {
    height: 150,
  },
  badgeRow: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
  },
  completedBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
  },
  overlayTitleWrap: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.sm,
  },
  overlayTitle: {
    ...typography.title,
    color: colors.text,
  },
  body: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  title: {
    ...typography.title,
    color: colors.text,
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
});
