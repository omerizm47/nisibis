import { useEffect, useState } from 'react';
import type React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { setAppLanguage } from '@/i18n';
import { OrnamentDivider } from '@/components';
import { type AppLanguage, SUPPORTED_LANGUAGES } from '@/utils/constants';
import { colors, radius, spacing, typography } from '@/theme';
import { hapticSelection } from '@/utils/haptics';
import type { MciName } from '@/utils/icons';
import { upperLocale } from '@/utils/text';
import { isRtl } from '@/utils/rtl';

const SOURCES: { title: string; url: string }[] = [
  { title: 'Türkiye Kültür Portalı', url: 'https://www.kulturportali.gov.tr/turkiye/mardin' },
  { title: 'Mardin İl Kültür ve Turizm Müdürlüğü', url: 'https://mardin.ktb.gov.tr' },
  { title: 'TDV İslam Ansiklopedisi — Nusaybin', url: 'https://islamansiklopedisi.org.tr/nusaybin' },
  { title: 'Vikipedi — Nusaybin', url: 'https://tr.wikipedia.org/wiki/Nusaybin' },
  { title: 'Wikimedia Commons — Nusaybin', url: 'https://commons.wikimedia.org/wiki/Category:Nusaybin' },
];

function Section({ title, children, index = 0 }: { title: string; children: React.ReactNode; index?: number }) {
  const { i18n } = useTranslation();
  return (
    <Animated.View entering={FadeInDown.duration(320).delay(Math.min(index, 6) * 70)} style={styles.section}>
      <Text style={styles.sectionTitle}>{upperLocale(title, i18n.language)}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </Animated.View>
  );
}

function Row({
  icon,
  label,
  value,
  onPress,
}: {
  icon: MciName;
  label: string;
  value?: string;
  onPress?: () => void;
}) {
  const { i18n } = useTranslation();
  const rtl = isRtl(i18n.language);
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, pressed && onPress ? styles.pressed : null]}
    >
      <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />
      <Text style={styles.rowLabel}>{label}</Text>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      {onPress ? <MaterialCommunityIcons name={rtl ? 'chevron-left' : 'chevron-right'} size={20} color={colors.subtleText} /> : null}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const current = (i18n.language || 'tr').split('-')[0];

  const [perm, setPerm] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');

  useEffect(() => {
    void Location.getForegroundPermissionsAsync().then((p) =>
      setPerm(p.granted ? 'granted' : p.canAskAgain ? 'undetermined' : 'denied'),
    );
  }, []);

  const requestLocation = async () => {
    const p = await Location.requestForegroundPermissionsAsync();
    setPerm(p.granted ? 'granted' : 'denied');
  };

  const langLabel: Record<AppLanguage, string> = {
    tr: t('settings.languageTr'),
    en: t('settings.languageEn'),
    ar: t('settings.languageAr'),
  };

  const locationStatus =
    perm === 'granted'
      ? t('settings.locationGranted')
      : perm === 'denied'
        ? t('settings.locationDenied')
        : t('settings.locationUndetermined');

  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.duration(300)} style={styles.titleWrap}>
        <Text style={styles.title}>{t('settings.title')}</Text>
        <Text style={styles.subtitle}>{t('settings.subtitle')}</Text>
        <OrnamentDivider style={styles.headerDivider} />
      </Animated.View>

      <Section title={t('settings.language')} index={1}>
        <View style={styles.langRow}>
          {SUPPORTED_LANGUAGES.map((code) => {
            const active = current === code;
            return (
              <Pressable
                key={code}
                onPress={() => {
                  hapticSelection();
                  void setAppLanguage(code);
                }}
                style={[styles.langChip, active && styles.langChipActive]}
              >
                <Text style={[styles.langText, active && styles.langTextActive]}>
                  {langLabel[code]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Section>

      <Section title={t('settings.locationStatus')} index={2}>
        <Row icon="map-marker-outline" label={t('settings.locationStatus')} value={locationStatus} />
        {perm !== 'granted' ? (
          <Pressable onPress={() => void requestLocation()} style={styles.inlineBtn}>
            <Text style={styles.inlineBtnText}>{t('map.enableLocation')}</Text>
          </Pressable>
        ) : null}
      </Section>

      <Section title={t('settings.privacy')} index={3}>
        <Row
          icon="shield-check-outline"
          label={t('settings.privacy')}
          onPress={() => router.push('/privacy')}
        />
      </Section>

      <Section title={t('settings.sources')} index={4}>
        <Text style={styles.sourcesIntro}>{t('settings.sourcesIntro')}</Text>
        {SOURCES.map((s) => (
          <Row key={s.url} icon="link-variant" label={s.title} onPress={() => void Linking.openURL(s.url)} />
        ))}
      </Section>

      <Section title={t('settings.about')} index={5}>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutBrand}>{t('app.name')}</Text>
          <Text style={styles.aboutTagline}>{t('app.tagline')}</Text>
          <Text style={styles.aboutBody}>{t('settings.aboutBody')}</Text>
          <Text style={styles.version}>
            {t('settings.version')} {version}
          </Text>
        </View>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.x3l,
    gap: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.mutedText,
  },
  titleWrap: {
    gap: spacing.sm,
  },
  headerDivider: {
    marginTop: spacing.xs,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.overline,
    color: colors.subtleText,
    marginLeft: spacing.xs,
  },
  sectionBody: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  pressed: {
    backgroundColor: colors.cardAlt,
  },
  rowLabel: {
    ...typography.bodyMedium,
    color: colors.text,
    flex: 1,
  },
  rowValue: {
    ...typography.caption,
    color: colors.mutedText,
  },
  langRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  langChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  langText: {
    ...typography.label,
    color: colors.mutedText,
  },
  langTextActive: {
    color: colors.onPrimary,
  },
  inlineBtn: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  inlineBtnText: {
    ...typography.label,
    color: colors.primary,
  },
  sourcesIntro: {
    ...typography.caption,
    color: colors.mutedText,
    padding: spacing.md,
    paddingBottom: spacing.xs,
  },
  aboutCard: {
    padding: spacing.lg,
    gap: spacing.xs,
  },
  aboutBrand: {
    ...typography.h2,
    color: colors.primary,
  },
  aboutTagline: {
    ...typography.bodyMedium,
    color: colors.mutedText,
  },
  aboutBody: {
    ...typography.body,
    color: colors.mutedText,
    marginTop: spacing.sm,
  },
  version: {
    ...typography.caption,
    color: colors.subtleText,
    marginTop: spacing.sm,
  },
});
