import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { getPlaceById } from '@/hooks';
import type { TourTask } from '@/types';
import { colors, radius, spacing, typography } from '@/theme';
import { withAlpha } from '@/utils/color';
import type { MciName } from '@/utils/icons';
import { useCelebration } from './Celebration';

interface TaskItemProps {
  task: TourTask;
  completed: boolean;
  /** Uygulanmadiysa false doner; kutlama ancak kayit gerceklestiyse yapilir. */
  onToggle: () => boolean;
  style?: StyleProp<ViewStyle>;
}

export function TaskItem({ task, completed, onToggle, style }: TaskItemProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { celebrate } = useCelebration();
  const relatedPlace = task.relatedPoiId ? getPlaceById(task.relatedPoiId) : undefined;
  const mekanaGit = relatedPlace ? () => router.push(`/place/${relatedPlace.id}`) : undefined;
  const mekanEtiketi = relatedPlace
    ? t('checklist.goToPlace', { place: relatedPlace.name })
    : undefined;

  const handle = () => {
    if (!onToggle()) return;
    if (completed) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      celebrate();
    }
  };

  return (
    <Pressable
      onPress={handle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: completed }}
      // Kart tek bir erisilebilirlik ogesi oldugu icin ic baglantiya ekran okuyucu
      // ile dokunulamiyor; mekan ayri bir eylem olarak sunuluyor. Yeni mimaride iOS
      // eylemin label'ini degil name'ini okudugu icin ikisi de ayni metin.
      accessibilityActions={mekanEtiketi ? [{ name: mekanEtiketi, label: mekanEtiketi }] : undefined}
      onAccessibilityAction={
        mekanaGit
          ? (e) => {
              if (e.nativeEvent.actionName === mekanEtiketi) mekanaGit();
            }
          : undefined
      }
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
        <View style={styles.metaRow}>
          <Text style={styles.points}>{t('checklist.points', { points: task.points })}</Text>
          {relatedPlace ? (
            <Pressable
              onPress={mekanaGit}
              accessibilityRole="link"
              accessibilityLabel={mekanEtiketi}
              style={({ pressed }) => [styles.placeLink, pressed && styles.pressed]}
            >
              <MaterialCommunityIcons name="map-marker-outline" size={13} color={colors.primary} />
              <Text style={styles.placeLinkText} numberOfLines={1}>
                {relatedPlace.name}
              </Text>
            </Pressable>
          ) : null}
        </View>
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: 2,
  },
  points: {
    ...typography.overline,
    color: colors.primary,
  },
  placeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flexShrink: 1,
    // hitSlop ebeveyn sinirini asamadigi icin dokunma alani kutunun kendisi kadar.
    // 32dp, WCAG 2.5.8 AA esigini (24dp) gecer; 44dp'ye cikarmak kart yuksekligini
    // gorev basina 30dp buyuturdu ve asil hedef zaten kartin tamami.
    minHeight: 32,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: withAlpha(colors.primary, 0.08),
  },
  placeLinkText: {
    ...typography.overline,
    color: colors.primary,
    flexShrink: 1,
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
