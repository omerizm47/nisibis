import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OrnamentDivider, RouteCard } from '@/components';
import { useProgress, useRoutes } from '@/hooks';
import { colors, spacing, typography } from '@/theme';

export default function RoutesScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const routes = useRoutes();
  const { isPlaceCompleted } = useProgress();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <FlatList
        data={routes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{t('routes.title')}</Text>
            <Text style={styles.subtitle}>{t('routes.subtitle')}</Text>
            <OrnamentDivider style={styles.headerDivider} />
          </View>
        }
        renderItem={({ item, index }) => {
          const completedStops = item.poiIds.filter((id) => isPlaceCompleted(id)).length;
          return (
            <Animated.View entering={FadeInDown.duration(280).delay(Math.min(index, 10) * 50)}>
              <RouteCard
                route={item}
                completedStops={completedStops}
                onPress={() => router.push(`/route/${item.id}`)}
              />
            </Animated.View>
          );
        }}
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
});
