import { useTranslation } from 'react-i18next';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OrnamentDivider, PrimaryButton, ProgressCard, TaskItem } from '@/components';
import { useProgress, useTasks } from '@/hooks';
import { colors, spacing, typography } from '@/theme';

export default function ChecklistScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const tasks = useTasks();
  const {
    isTaskCompleted,
    toggleTask,
    resetProgress,
    percent,
    completedCount,
    totalCount,
    points,
  } = useProgress();

  const confirmReset = () => {
    Alert.alert(t('checklist.resetConfirmTitle'), t('checklist.resetConfirmBody'), [
      { text: t('checklist.cancel'), style: 'cancel' },
      { text: t('checklist.resetConfirm'), style: 'destructive', onPress: resetProgress },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{t('checklist.title')}</Text>
            <Text style={styles.subtitle}>{t('checklist.subtitle')}</Text>
            <OrnamentDivider style={styles.headerDivider} />
            <ProgressCard
              percent={percent}
              completedCount={completedCount}
              totalCount={totalCount}
              points={points}
              style={styles.progress}
            />
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
          completedCount > 0 ? (
            <PrimaryButton
              label={t('checklist.reset')}
              icon="restore"
              variant="ghost"
              onPress={confirmReset}
              style={styles.reset}
            />
          ) : null
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
  reset: {
    marginTop: spacing.lg,
  },
});
