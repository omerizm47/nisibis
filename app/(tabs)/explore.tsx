import { useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState, PlaceCard, StoryCard } from '@/components';
import { usePlaces, useProgress } from '@/hooks';
import { PLACE_CATEGORIES, type PlaceCategory } from '@/types';
import { colors, radius, spacing, typography } from '@/theme';

type Filter = PlaceCategory | 'all';

export default function ExploreScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isPlaceCompleted } = useProgress();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const places = usePlaces({ category: filter, query });

  const filters = useMemo<{ key: Filter; label: string }[]>(
    () => [
      { key: 'all', label: t('explore.all') },
      ...PLACE_CATEGORIES.map((c) => ({ key: c, label: t(`categories.${c}`) })),
    ],
    [t],
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <Text style={styles.title}>{t('explore.title')}</Text>

      <View style={styles.searchBox}>
        <MaterialCommunityIcons name="magnify" size={20} color={colors.subtleText} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('explore.searchPlaceholder')}
          placeholderTextColor={colors.subtleText}
          style={styles.searchInput}
          returnKeyType="search"
        />
        {query.length > 0 ? (
          <Pressable
            onPress={() => setQuery('')}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={t('common.clear')}
          >
            <MaterialCommunityIcons name="close-circle" size={18} color={colors.subtleText} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.chipsWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {filters.map((f) => {
            const active = filter === f.key;
            return (
              <Pressable
                key={f.key}
                onPress={() => setFilter(f.key)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListHeaderComponent={
          !query && filter === 'all' ? (
            <StoryCard onPress={() => router.push('/story')} style={styles.storyHeader} />
          ) : null
        }
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.duration(280).delay(Math.min(index, 10) * 40)}>
            <PlaceCard
              place={item}
              completed={isPlaceCompleted(item.id)}
              onPress={() => router.push(`/place/${item.id}`)}
            />
          </Animated.View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="map-search-outline"
            title={t('explore.emptyTitle')}
            message={t('explore.emptyBody')}
          />
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
  title: {
    ...typography.h1,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
    height: 48,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    padding: 0,
  },
  chipsWrap: {
    marginTop: spacing.md,
  },
  chips: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.label,
    color: colors.mutedText,
  },
  chipTextActive: {
    color: colors.onPrimary,
  },
  list: {
    padding: spacing.lg,
    paddingBottom: spacing.x3l,
  },
  storyHeader: {
    marginBottom: spacing.md,
  },
});
