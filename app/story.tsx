import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Emblem, KilimBand, OrnamentDivider, PrimaryButton, ScreenHeader, StoneLattice } from '@/components';
import { colors, fontFamily, gradients, radius, spacing, typography } from '@/theme';
import { withAlpha } from '@/utils/color';
import type { MciName } from '@/utils/icons';

interface Block {
  icon: MciName;
  titleKey: string;
  bodyKey: string;
}

interface TimelineItem {
  year: string;
  title: string;
  body: string;
}

const BLOCKS: Block[] = [
  { icon: 'layers-outline', titleKey: 'story.layersTitle', bodyKey: 'story.layersBody' },
  { icon: 'puzzle-outline', titleKey: 'story.mosaicTitle', bodyKey: 'story.mosaicBody' },
  { icon: 'school-outline', titleKey: 'story.schoolTitle', bodyKey: 'story.schoolBody' },
];

export default function StoryScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const timelineRaw = t('story.timeline', { returnObjects: true });
  const timeline: TimelineItem[] = Array.isArray(timelineRaw) ? (timelineRaw as TimelineItem[]) : [];

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xs }]}>
      <ScreenHeader title={t('story.title')} onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <LinearGradient colors={gradients.hero} style={StyleSheet.absoluteFill} />
          <StoneLattice patternId="story-hero-lattice" color={colors.clay} opacity={0.16} tile={34} />
          <Emblem size={98} color={colors.primary} accent={colors.copper} style={styles.emblem} />
          <Text style={styles.heroOverline}>NISIBIS</Text>
          <Text style={styles.heroTitle}>{t('story.cardTitle')}</Text>
          <KilimBand patternId="hero-kilim" color={colors.copper} accent={colors.primary} height={14} style={styles.heroKilim} />
        </View>

        <View style={styles.introWrap}>
          <View style={styles.dropCap}>
            <Text style={styles.dropCapText}>{t('story.intro').trim().charAt(0)}</Text>
          </View>
          <Text style={styles.introText}>{t('story.intro').trim().slice(1)}</Text>
        </View>

        <OrnamentDivider style={{ marginVertical: spacing.xs }} />

        <Animated.View entering={FadeInDown.duration(320)} style={styles.antiquity}>
          <StoneLattice patternId="antiquity-lattice" color={colors.copper} opacity={0.1} tile={32} />
          <View style={styles.antiquityHeader}>
            <MaterialCommunityIcons name="history" size={18} color={colors.primary} />
            <Text style={styles.antiquityOverline}>{t('story.antiquityOverline')}</Text>
          </View>
          <Text style={styles.antiquityStat}>{t('story.antiquityStat')}</Text>
          <Text style={styles.antiquityTitle}>{t('story.antiquityTitle')}</Text>
          <Text style={styles.antiquityBody}>{t('story.antiquityBody')}</Text>
        </Animated.View>

        {BLOCKS.map((b, i) => (
          <Animated.View
            key={b.titleKey}
            entering={FadeInDown.duration(320).delay(i * 90)}
            style={styles.block}
          >
            <View style={styles.blockIcon}>
              <MaterialCommunityIcons name={b.icon} size={22} color={colors.primary} />
            </View>
            <View style={styles.blockBody}>
              <Text style={styles.blockTitle}>{t(b.titleKey)}</Text>
              <Text style={styles.blockText}>{t(b.bodyKey)}</Text>
            </View>
          </Animated.View>
        ))}

        {timeline.length > 0 ? (
          <View style={styles.timeline}>
            <Text style={styles.timelineTitle}>{t('story.timelineTitle')}</Text>
            <View style={styles.timelineList}>
              {timeline.map((item, i) => (
                <Animated.View
                  key={`${item.year}-${i}`}
                  entering={FadeInDown.duration(300).delay(Math.min(i, 6) * 60)}
                  style={styles.tlRow}
                >
                  <View style={styles.tlRail}>
                    <View style={styles.tlNode}>
                      <View style={styles.tlNodeInner} />
                    </View>
                    {i < timeline.length - 1 ? <View style={styles.tlLine} /> : null}
                  </View>
                  <View style={styles.tlContent}>
                    <View style={styles.tlYearBadge}>
                      <Text style={styles.tlYear}>{item.year}</Text>
                    </View>
                    <Text style={styles.tlTitle}>{item.title}</Text>
                    <Text style={styles.tlBody}>{item.body}</Text>
                  </View>
                </Animated.View>
              ))}
            </View>
          </View>
        ) : null}

        <PrimaryButton
          label={t('story.cta')}
          icon="compass-outline"
          onPress={() => router.back()}
          style={styles.cta}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.x3l,
  },
  hero: {
    borderRadius: radius.x2l,
    overflow: 'hidden',
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: withAlpha(colors.primary, 0.25),
  },
  emblem: {
    marginBottom: spacing.xs,
  },
  heroKilim: {
    alignSelf: 'stretch',
    marginTop: spacing.md,
    marginHorizontal: -spacing.xl,
  },
  introWrap: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
    paddingHorizontal: spacing.xs,
  },
  dropCap: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: withAlpha(colors.primary, 0.1),
    borderWidth: 1,
    borderColor: withAlpha(colors.primary, 0.4),
  },
  dropCapText: {
    fontFamily: fontFamily.displayBold,
    fontSize: 32,
    lineHeight: 38,
    color: colors.primary,
  },
  introText: {
    ...typography.body,
    color: colors.mutedText,
    flex: 1,
  },
  heroIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: withAlpha(colors.primary, 0.12),
    borderWidth: 1,
    borderColor: withAlpha(colors.primary, 0.3),
    marginBottom: spacing.sm,
  },
  heroOverline: {
    ...typography.overline,
    color: colors.primary,
    letterSpacing: 3,
    textAlign: 'center',
  },
  heroTitle: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
  },
  block: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  blockIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardAlt,
  },
  blockBody: {
    flex: 1,
    gap: spacing.xs,
  },
  blockTitle: {
    ...typography.title,
    color: colors.text,
  },
  blockText: {
    ...typography.body,
    color: colors.mutedText,
  },
  cta: {
    marginTop: spacing.sm,
  },
  antiquity: {
    backgroundColor: colors.card,
    borderRadius: radius.x2l,
    borderWidth: 1,
    borderColor: withAlpha(colors.primary, 0.25),
    padding: spacing.lg,
    gap: spacing.xs,
    overflow: 'hidden',
  },
  antiquityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  antiquityOverline: {
    ...typography.overline,
    color: colors.primary,
    letterSpacing: 2,
  },
  antiquityStat: {
    ...typography.h1,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  antiquityTitle: {
    ...typography.title,
    color: colors.text,
  },
  antiquityBody: {
    ...typography.body,
    color: colors.mutedText,
  },
  timeline: {
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  timelineTitle: {
    ...typography.h2,
    color: colors.text,
  },
  timelineList: {
    marginTop: spacing.xs,
  },
  tlRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  tlRail: {
    width: 18,
    alignItems: 'center',
  },
  tlNode: {
    width: 14,
    height: 14,
    borderRadius: 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
    marginTop: 5,
  },
  tlNodeInner: {
    width: 5,
    height: 5,
    backgroundColor: colors.card,
  },
  tlLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginTop: 2,
  },
  tlContent: {
    flex: 1,
    paddingBottom: spacing.lg,
    gap: 2,
  },
  tlYearBadge: {
    alignSelf: 'flex-start',
    backgroundColor: withAlpha(colors.primary, 0.12),
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginBottom: 2,
  },
  tlYear: {
    ...typography.overline,
    color: colors.primary,
    letterSpacing: 1,
  },
  tlTitle: {
    ...typography.title,
    color: colors.text,
  },
  tlBody: {
    ...typography.body,
    color: colors.mutedText,
  },
});
