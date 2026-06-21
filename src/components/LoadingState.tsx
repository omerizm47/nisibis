import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, spacing, typography } from '@/theme';

interface LoadingStateProps {
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export function LoadingState({ label, style }: LoadingStateProps) {
  const { t } = useTranslation();
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.label}>{label ?? t('common.loading')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.mutedText,
  },
});
