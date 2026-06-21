import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components';
import { colors, radius, spacing, typography } from '@/theme';
import { withAlpha } from '@/utils/color';

export default function PrivacyScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const principles = [
    t('privacy.free'),
    t('privacy.noAccount'),
    t('privacy.locationOnlyInApp'),
    t('privacy.noServer'),
    t('privacy.noPersonalData'),
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xs }]}>
      <ScreenHeader title={t('privacy.title')} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="shield-lock-outline" size={40} color={colors.primary} />
        </View>
        <Text style={styles.intro}>{t('privacy.intro')}</Text>

        <View style={styles.list}>
          {principles.map((p) => (
            <View key={p} style={styles.item}>
              <MaterialCommunityIcons name="check-circle" size={20} color={colors.success} />
              <Text style={styles.itemText}>{p}</Text>
            </View>
          ))}
        </View>
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
    gap: spacing.lg,
  },
  iconWrap: {
    alignSelf: 'center',
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: withAlpha(colors.primary, 0.12),
    borderWidth: 1,
    borderColor: withAlpha(colors.primary, 0.3),
    marginTop: spacing.md,
  },
  intro: {
    ...typography.subtitle,
    color: colors.text,
    textAlign: 'center',
  },
  list: {
    gap: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  itemText: {
    ...typography.body,
    color: colors.mutedText,
    flex: 1,
  },
});
