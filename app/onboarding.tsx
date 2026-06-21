import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OnboardingArt, PatternBackdrop, PrimaryButton } from '@/components';
import { useLocation } from '@/hooks';
import { useOnboarding } from '@/hooks/useOnboarding';
import { colors, gradients, radius, spacing, typography } from '@/theme';

interface Step {
  titleKey: string;
  bodyKey: string;
}

const STEPS: Step[] = [
  { titleKey: 'onboarding.welcomeTitle', bodyKey: 'onboarding.welcomeBody' },
  { titleKey: 'onboarding.discoverTitle', bodyKey: 'onboarding.discoverBody' },
  { titleKey: 'onboarding.locationTitle', bodyKey: 'onboarding.locationBody' },
];

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { markComplete } = useOnboarding();
  const { requestPermission } = useLocation(false);
  const [step, setStep] = useState(0);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const finish = () => {
    markComplete();
    router.replace('/');
  };

  const handleNext = () => {
    if (isLast) {
      finish();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleAllowLocation = async () => {
    await requestPermission();
    finish();
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradients.hero} style={StyleSheet.absoluteFill} />
      <PatternBackdrop patternId="onboarding-stars" color={colors.primary} opacity={0.1} tile={52} />

      <View style={[styles.top, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.brand}>{t('app.name')}</Text>
        {!isLast ? (
          <Text style={styles.skip} onPress={finish}>
            {t('onboarding.skip')}
          </Text>
        ) : (
          <View />
        )}
      </View>

      <Animated.View key={step} entering={FadeIn.duration(350)} style={styles.body}>
        <OnboardingArt step={step} size={216} style={styles.art} />
        <Text style={styles.title}>{t(current.titleKey)}</Text>
        <Text style={styles.text}>{t(current.bodyKey)}</Text>
      </Animated.View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.xl }]}>
        <View style={styles.dots}>
          {STEPS.map((s, i) => (
            <View key={s.titleKey} style={[styles.dot, i === step && styles.dotActive]} />
          ))}
        </View>

        {isLast ? (
          <View style={styles.lastActions}>
            <PrimaryButton
              label={t('onboarding.allowLocation')}
              icon="map-marker-check-outline"
              onPress={handleAllowLocation}
            />
            <PrimaryButton
              label={t('onboarding.continueWithout')}
              variant="ghost"
              onPress={finish}
            />
          </View>
        ) : (
          <PrimaryButton label={t('onboarding.next')} icon="arrow-right" onPress={handleNext} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  brand: {
    ...typography.h2,
    color: colors.primary,
  },
  skip: {
    ...typography.bodyMedium,
    color: colors.mutedText,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  art: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.hero,
    color: colors.text,
    textAlign: 'center',
  },
  text: {
    ...typography.body,
    color: colors.mutedText,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderStrong,
  },
  dotActive: {
    width: 22,
    backgroundColor: colors.primary,
  },
  lastActions: {
    gap: spacing.sm,
  },
});
