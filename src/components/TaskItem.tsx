import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type { TourTask } from '@/types';
import { colors, radius, spacing, typography } from '@/theme';
import { withAlpha } from '@/utils/color';
import type { MciName } from '@/utils/icons';
import { useCelebration } from './Celebration';

interface TaskItemProps {
  task: TourTask;
  completed: boolean;
  onToggle: () => void;
  style?: StyleProp<ViewStyle>;
}

export function TaskItem({ task, completed, onToggle, style }: TaskItemProps) {
  const { t } = useTranslation();
  const { celebrate } = useCelebration();

  const handle = () => {
    if (completed) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      celebrate();
    }
    onToggle();
  };

  return (
    <Pressable
      onPress={handle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: completed }}
      style={({ pressed }) => [styles.row, completed && styles.rowDone, pressed && styles.pressed, style]}
    >
      <View style={[styles.iconWrap, completed && styles.iconWrapDone]}>
        <MaterialCommunityIcons
          name={task.icon as MciName}
          size={20}
          color={completed ? colors.onPrimary : colors.primary}
        />
      </View>
      <View style={styles.body}>
        <Text style={[styles.title, completed && styles.titleDone]} numberOfLines={2}>
          {task.title}
        </Text>
        <Text style={styles.desc} numberOfLines={3}>
          {task.description}
        </Text>
        <Text style={styles.points}>{t('checklist.points', { points: task.points })}</Text>
      </View>
      <View style={[styles.check, completed && styles.checkDone]}>
        {completed ? (
          <MaterialCommunityIcons name="check-bold" size={15} color={colors.onPrimary} style={styles.checkIcon} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  rowDone: {
    borderColor: colors.borderStrong,
    backgroundColor: colors.cardMuted,
  },
  pressed: {
    opacity: 0.92,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: withAlpha(colors.copper, 0.45),
  },
  iconWrapDone: {
    backgroundColor: colors.primary,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
  },
  titleDone: {
    color: colors.mutedText,
    textDecorationLine: 'line-through',
  },
  desc: {
    ...typography.caption,
    color: colors.mutedText,
  },
  points: {
    ...typography.overline,
    color: colors.primary,
    marginTop: 2,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
  },
  checkIcon: {
    transform: [{ rotate: '-45deg' }],
  },
  checkDone: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
});
