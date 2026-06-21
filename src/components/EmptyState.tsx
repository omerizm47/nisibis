import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';
import { withAlpha } from '@/utils/color';
import type { MciName } from '@/utils/icons';
import { ArchFrame } from './ArchFrame';
import { PatternBackdrop } from './Ornament';
import { PrimaryButton } from './PrimaryButton';

interface EmptyStateProps {
  icon?: MciName;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({
  icon = 'compass-outline',
  title,
  message,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <PatternBackdrop patternId="empty-state-stars" opacity={0.06} tile={50} />
      <View style={styles.niche}>
        <ArchFrame archColor={colors.background} archHeight={36} style={StyleSheet.absoluteFill} />
        <MaterialCommunityIcons name={icon} size={30} color={colors.primary} style={styles.nicheIcon} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <PrimaryButton label={actionLabel} onPress={onAction} variant="secondary" style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.x3l,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  niche: {
    width: 80,
    height: 98,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: spacing.md,
    backgroundColor: withAlpha(colors.copper, 0.16),
    marginBottom: spacing.xs,
    overflow: 'hidden',
  },
  nicheIcon: {
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: colors.mutedText,
    textAlign: 'center',
  },
  action: {
    marginTop: spacing.md,
    alignSelf: 'stretch',
  },
});
