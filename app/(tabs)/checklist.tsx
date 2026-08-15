import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CityInviteCard, OrnamentDivider, PrimaryButton, ProgressCard, StoneLattice, TaskItem } from '@/components';
import { useCity, useProgress, useTasks } from '@/hooks';
import { colors, radius, spacing, typography } from '@/theme';
import { withAlpha } from '@/utils/color';

export default function ChecklistScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const tasks = useTasks();
  const { city } = useCity();
  const {
    isTaskCompleted,
    toggleTask,
    resetProgress,
    percent,
    completedCount,
    completedPlaceIds,
    totalCount,
    points,
    isTourComplete,
  } = useProgress();

  // Gorevi olmayan mekanlar da ziyaret edilmis olabilir; sifirlama onlari da kapsar.
  const ilerlemeVar = completedCount > 0 || completedPlaceIds.length > 0;

  const confirmReset = () => {
    Alert.alert(
      t('checklist.resetConfirmTitle'),
      t('checklist.resetConfirmBody', { city: city.name }),
      [
        { text: t('checklist.cancel'), style: 'cancel' },
        { text: t('checklist.resetConfirm'), style: 'destructive', onPress: resetProgress },
      ],
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <StoneLattice patternId="checklist-bg" color={colors.clay} opacity={0.05} tile={40} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{t('checklist.title')}</Text>
            <Text style={styles.subtitle}>{t('checklist.subtitle', { city: city.name })}</Text>
            <OrnamentDivider style={styles.headerDivider} />
            <ProgressCard
              percent={percent}
              completedCount={completedCount}
              totalCount={totalCount}
              points={points}
              style={styles.progress}
            />
            {isTourComplete ? (
              <View style={styles.allDone}>
                <MaterialCommunityIcons name="trophy-outline" size={20} color={colors.primary} />
                <Text style={styles.allDoneText}>
                  {t('progress.tourComplete', { city: city.name })}
                </Text>
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.duration(260).delay(Math.min(index, 12) * 35)}>
            <TaskItem
              task={item}
              completed={isTaskCompleted(item.id)}
              onToggle={() => toggleTask(item.id)}
            />
          </Animated.View>
        )}
        ListFooterComponent={
          <View style={styles.footer}>
            {isTourComplete ? <CityInviteCard variant="done" /> : null}
            {ilerlemeVar ? (
              <PrimaryButton
                label={t('checklist.reset')}
                icon="restore"
                variant="ghost"
                onPress={confirmReset}
              />
            ) : null}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.lg,
    paddingBottom: spacing.x3l,
  },
  header: {
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.mutedText,
  },
  headerDivider: {
    marginTop: spacing.md,
  },
  progress: {
    marginTop: spacing.md,
  },
  allDone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: withAlpha(colors.primary, 0.4),
    backgroundColor: withAlpha(colors.primary, 0.08),
  },
  allDoneText: {
    ...typography.bodyMedium,
    color: colors.primary,
    flex: 1,
  },
  footer: {
    marginTop: spacing.lg,
    gap: spacing.lg,
  },
});
