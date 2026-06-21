import type React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArchFrame, CategoryBadge, CategoryIcon, EmptyState, KilimBand, PrimaryButton, RemoteImage, SafetyNotice, StoneLattice, useCelebration } from '@/components';
import { getPlaceImageSource } from '@/data/placeImages';
import { getNearbyPlaces, getPlaceById, useProgress } from '@/hooks';
import { colors, getCategoryMeta, gradients, radius, spacing, typography } from '@/theme';
import { withAlpha } from '@/utils/color';
import { formatDistance } from '@/utils/distance';
import { placeHasMapLocation } from '@/utils/map';
import { isRtl } from '@/utils/rtl';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionDiamond} />
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionRule} />
      </View>
      {children}
    </View>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <View style={styles.bullets}>
      {items.map((item, i) => (
        <View key={`${i}-${item.slice(0, 10)}`} style={styles.bulletRow}>
          <View style={styles.bulletDiamond} />
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export default function PlaceDetailScreen() {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const rtl = isRtl(i18n.language);
  const { id } = useLocalSearchParams<{ id: string }>();
  const place = id ? getPlaceById(id) : undefined;
  const { isPlaceCompleted, togglePlaceVisited } = useProgress();
  const { celebrate } = useCelebration();
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  const heroImageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: scrollY.value > 0 ? scrollY.value * 0.4 : 0 },
      { scale: scrollY.value < 0 ? 1 + -scrollY.value / 280 : 1 },
    ],
  }));

  if (!place) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <EmptyState
          icon="map-marker-off-outline"
          title={t('place.notFound')}
          actionLabel={t('common.back')}
          onAction={() => router.back()}
        />
      </View>
    );
  }

  const completed = isPlaceCompleted(place.id);
  const showApprox = !place.coordinatesVerified && placeHasMapLocation(place);
  const nearby = getNearbyPlaces(place.id);

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 96 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.hero}>
          <Animated.View style={[StyleSheet.absoluteFill, heroImageStyle]}>
            <RemoteImage source={getPlaceImageSource(place)} style={StyleSheet.absoluteFill} />
            <LinearGradient colors={gradients.imageScrim} style={StyleSheet.absoluteFill} />
          </Animated.View>
          <StoneLattice patternId="place-hero-lattice" color={colors.limestone} opacity={0.16} tile={36} />
          <ArchFrame archColor={colors.background} archHeight={52} style={StyleSheet.absoluteFill} />
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel={t('common.back')}
            style={[styles.backBtn, { top: insets.top + spacing.sm }, rtl ? { left: undefined, right: spacing.lg } : null]}
            hitSlop={10}
          >
            <MaterialCommunityIcons name={rtl ? 'chevron-right' : 'chevron-left'} size={26} color={colors.text} />
          </Pressable>
          {completed ? (
            <View style={[styles.completedBadge, { top: insets.top + spacing.sm }, rtl ? { right: undefined, left: spacing.lg } : null]}>
              <MaterialCommunityIcons name="check-bold" size={16} color={colors.onPrimary} />
            </View>
          ) : null}
          <View style={styles.heroFooter}>
            <CategoryBadge category={place.category} />
            {place.isFeatured ? (
              <View style={styles.featuredChip}>
                <MaterialCommunityIcons name="star" size={12} color={colors.onPrimary} />
                <Text style={styles.featuredText}>{t('place.featured')}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <KilimBand patternId="place-hero-kilim" color={colors.copper} accent={colors.primary} height={14} />

        <View style={styles.body}>
          <Text style={styles.title}>{place.name}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="clock-outline" size={15} color={colors.subtleText} />
              <Text style={styles.metaText}>
                {t('place.estimatedVisit')}: {t('common.minutes', { count: place.estimatedVisitMinutes })}
              </Text>
            </View>
            {showApprox ? (
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name="map-marker-question-outline" size={15} color={colors.subtleText} />
                <Text style={styles.metaText}>{t('common.approxLocation')}</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.lead}>{place.shortDescription}</Text>

          {place.longDescription ? (
            <Section title={t('place.about')}>
              <Text style={styles.paragraph}>{place.longDescription}</Text>
            </Section>
          ) : null}

          {place.history ? (
            <Section title={t('place.history')}>
              <Text style={styles.paragraph}>{place.history}</Text>
            </Section>
          ) : null}

          {place.activities.length > 0 ? (
            <Section title={t('place.activities')}>
              <Bullets items={place.activities} />
            </Section>
          ) : null}

          {place.tips.length > 0 ? (
            <Section title={t('place.tips')}>
              <Bullets items={place.tips} />
            </Section>
          ) : null}

          {place.photoTips.length > 0 ? (
            <Section title={t('place.photoTips')}>
              <Bullets items={place.photoTips} />
            </Section>
          ) : null}

          {place.safetyNotes.length > 0 ? (
            <SafetyNotice notes={place.safetyNotes} style={styles.notice} />
          ) : null}

          {place.sources.length > 0 ? (
            <Section title={t('common.sources')}>
              <View style={styles.sources}>
                {place.sources.map((s) => (
                  <Pressable
                    key={s.title}
                    onPress={() => (s.url ? void Linking.openURL(s.url) : undefined)}
                    style={styles.sourceRow}
                  >
                    <MaterialCommunityIcons name="link-variant" size={16} color={colors.primary} />
                    <Text style={styles.sourceText}>{s.title}</Text>
                  </Pressable>
                ))}
              </View>
            </Section>
          ) : null}

          {nearby.length > 0 ? (
            <Section title={t('place.nearby')}>
              <View style={styles.nearby}>
                {nearby.map(({ place: np, meters }) => {
                  const meta = getCategoryMeta(np.category);
                  return (
                    <Pressable
                      key={np.id}
                      onPress={() => router.push(`/place/${np.id}`)}
                      style={styles.nearbyRow}
                    >
                      <View style={[styles.nearbyIcon, { borderColor: meta.color }]}>
                        <CategoryIcon category={np.category} size={18} color={meta.color} />
                      </View>
                      <View style={styles.nearbyTexts}>
                        <Text style={styles.nearbyName} numberOfLines={1}>
                          {np.name}
                        </Text>
                        <Text style={styles.nearbyMeta}>{formatDistance(meters)}</Text>
                      </View>
                      <MaterialCommunityIcons name={rtl ? 'chevron-left' : 'chevron-right'} size={20} color={colors.subtleText} />
                    </Pressable>
                  );
                })}
              </View>
            </Section>
          ) : null}

          {place.imageCredit ? (
            <Text style={styles.credit}>Görsel: {place.imageCredit}</Text>
          ) : null}
        </View>
      </Animated.ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <PrimaryButton
          label={t('place.showOnMap')}
          icon="map-outline"
          variant="secondary"
          onPress={() => router.push({ pathname: '/', params: { focus: place.id } })}
          style={styles.flexBtn}
        />
        <PrimaryButton
          label={completed ? t('place.markedComplete') : t('place.markComplete')}
          icon={completed ? 'check-circle' : 'check-circle-outline'}
          onPress={() => {
            const wasCompleted = completed;
            togglePlaceVisited(place.id);
            if (!wasCompleted) {
              celebrate();
            }
          }}
          style={styles.flexBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    justifyContent: 'center',
  },
  hero: {
    height: 300,
    justifyContent: 'flex-end',
  },
  backBtn: {
    position: 'absolute',
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: withAlpha(colors.background, 0.55),
  },
  completedBadge: {
    position: 'absolute',
    right: spacing.lg,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
  },
  featuredChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  featuredText: {
    ...typography.overline,
    color: colors.onPrimary,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  title: {
    ...typography.hero,
    color: colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: -spacing.sm,
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
  reviewChip: {
    backgroundColor: withAlpha(colors.sand, 0.16),
    borderColor: withAlpha(colors.sand, 0.4),
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  reviewText: {
    ...typography.overline,
    color: colors.sand,
  },
  lead: {
    ...typography.subtitle,
    color: colors.mutedText,
    marginTop: -spacing.sm,
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionDiamond: {
    width: 10,
    height: 10,
    backgroundColor: colors.primary,
    transform: [{ rotate: '45deg' }],
    borderRadius: 1.5,
  },
  sectionTitle: {
    ...typography.title,
    color: colors.text,
  },
  sectionRule: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.xs,
  },
  paragraph: {
    ...typography.body,
    color: colors.mutedText,
  },
  bullets: {
    gap: spacing.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  bulletDiamond: {
    width: 7,
    height: 7,
    backgroundColor: colors.primary,
    transform: [{ rotate: '45deg' }],
    marginTop: 7,
  },
  bulletText: {
    ...typography.body,
    color: colors.mutedText,
    flex: 1,
  },
  notice: {
    marginTop: spacing.xs,
  },
  sources: {
    gap: spacing.sm,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sourceText: {
    ...typography.bodyMedium,
    color: colors.primary,
    flex: 1,
  },
  credit: {
    ...typography.caption,
    color: colors.subtleText,
  },
  nearby: {
    gap: spacing.sm,
  },
  nearbyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  nearbyIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    backgroundColor: colors.cardAlt,
  },
  nearbyTexts: {
    flex: 1,
  },
  nearbyName: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  nearbyMeta: {
    ...typography.caption,
    color: colors.subtleText,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: withAlpha(colors.background, 0.96),
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  flexBtn: {
    flex: 1,
  },
});
