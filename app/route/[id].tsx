import type React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState, PlaceCard, PrimaryButton, SafetyNotice } from '@/components';
import { getRouteById, getRoutePlaces, useProgress } from '@/hooks';
import { colors, gradients, radius, spacing, typography } from '@/theme';
import { withAlpha } from '@/utils/color';
import type { MciName } from '@/utils/icons';
import { isRtl } from '@/utils/rtl';

function MetaChip({ icon, text }: { icon: MciName; text: string }) {
  return (
    <View style={styles.metaChip}>
      <MaterialCommunityIcons name={icon} size={14} color={colors.primary} />
      <Text style={styles.metaChipText}>{text}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export default function RouteDetailScreen() {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const rtl = isRtl(i18n.language);
  const { id } = useLocalSearchParams<{ id: string }>();
  const route = id ? getRouteById(id) : undefined;
  const { isPlaceCompleted } = useProgress();

  if (!route) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <EmptyState
          icon="map-marker-path"
          title={t('routes.notFound')}
          actionLabel={t('common.back')}
          onAction={() => router.back()}
        />
      </View>
    );
  }

  const places = getRoutePlaces(route);
  const total = route.poiIds.length;
  const completedStops = route.poiIds.filter((pid) => isPlaceCompleted(pid)).length;
  const firstPoi = route.poiIds[0];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 96 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <LinearGradient colors={gradients.hero} style={StyleSheet.absoluteFill} />
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel={t('common.back')}
            style={[styles.backBtn, { top: insets.top + spacing.sm }, rtl ? { left: undefined, right: spacing.lg } : null]}
            hitSlop={10}
          >
            <MaterialCommunityIcons name={rtl ? 'chevron-right' : 'chevron-left'} size={26} color={colors.text} />
          </Pressable>
          <View style={[styles.heroContent, { paddingTop: insets.top + spacing.x3l }]}>
            <Text style={styles.title}>{route.title}</Text>
            <View style={styles.metaRow}>
              <MetaChip icon="clock-outline" text={route.estimatedDuration} />
              <MetaChip icon="chart-line-variant" text={t(`routes.difficulty_${route.difficulty}`)} />
              <MetaChip icon="weather-sunny" text={route.recommendedTime} />
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.description}>{route.description}</Text>

          <View style={styles.progressBlock}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${total ? Math.round((completedStops / total) * 100) : 0}%` },
                ]}
              />
            </View>
            <Text style={styles.progressLabel}>
              {t('routes.completedStops', { completed: completedStops, total })}
            </Text>
          </View>

          {route.highlights.length > 0 ? (
            <Section title={t('routes.highlights')}>
              <View style={styles.bullets}>
                {route.highlights.map((h, i) => (
                  <View key={`${i}-${h.slice(0, 10)}`} style={styles.bulletRow}>
                    <MaterialCommunityIcons name="star-four-points-outline" size={16} color={colors.primary} />
                    <Text style={styles.bulletText}>{h}</Text>
                  </View>
                ))}
              </View>
            </Section>
          ) : null}

          {route.safetyNotes.length > 0 ? (
            <SafetyNotice notes={route.safetyNotes} title={t('routes.visitNotes')} />
          ) : null}

          <Section title={t('routes.stops', { count: total })}>
            <View style={styles.stops}>
              {places.map((p, i) => (
                <Animated.View key={p.id} entering={FadeInDown.duration(280).delay(Math.min(i, 8) * 50)}>
                  <PlaceCard
                    place={p}
                    completed={isPlaceCompleted(p.id)}
                    onPress={() => router.push(`/place/${p.id}`)}
                  />
                </Animated.View>
              ))}
            </View>
          </Section>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <PrimaryButton
          label={t('routes.start')}
          icon="play"
          onPress={() =>
            firstPoi
              ? router.push({ pathname: '/', params: { focus: firstPoi } })
              : router.push('/')
          }
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
    minHeight: 180,
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
    zIndex: 2,
  },
  heroContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  title: {
    ...typography.hero,
    color: colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  metaChipText: {
    ...typography.label,
    color: colors.text,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  description: {
    ...typography.body,
    color: colors.mutedText,
  },
  progressBlock: {
    gap: spacing.xs,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.cardAlt,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  progressLabel: {
    ...typography.caption,
    color: colors.subtleText,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.title,
    color: colors.text,
  },
  bullets: {
    gap: spacing.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  bulletText: {
    ...typography.body,
    color: colors.mutedText,
    flex: 1,
  },
  stops: {
    gap: spacing.md,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: withAlpha(colors.background, 0.96),
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
