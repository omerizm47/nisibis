import { useCallback, useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState, OrnamentDivider, PlaceCard, StoneLattice, StoryCard } from '@/components';
import { useLocation, usePlaces, useProgress } from '@/hooks';
import { PLACE_CATEGORIES, type PlaceCategory } from '@/types';
import { colors, radius, shadow, spacing, typography } from '@/theme';
import { formatDistance, haversineDistance } from '@/utils/distance';
import { hapticSelection } from '@/utils/haptics';
import { getDisplayCoordinate } from '@/utils/map';

type Filter = PlaceCategory | 'all';
type Sort = 'featured' | 'nearest';

export default function ExploreScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isPlaceCompleted } = useProgress();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('featured');
  const [refreshing, setRefreshing] = useState(false);
  const [focused, setFocused] = useState(false);

  const { location, requestPermission } = useLocation();
  const places = usePlaces({ category: filter, query });

  const lat = location?.latitude ?? null;
  const lng = location?.longitude ?? null;

  const items = useMemo(() => {
    const origin = lat != null && lng != null ? { latitude: lat, longitude: lng } : null;
    const withDist = places.map((p) => {
      const c = getDisplayCoordinate(p);
      return { place: p, meters: origin && c ? haversineDistance(origin, c) : null };
    });
    if (sort === 'nearest' && origin) {
      return [...withDist].sort((a, b) => (a.meters ?? Infinity) - (b.meters ?? Infinity));
    }
    return [
      ...withDist.filter((x) => x.place.isFeatured),
      ...withDist.filter((x) => !x.place.isFeatured),
    ];
  }, [places, lat, lng, sort]);

  const selectSort = useCallback(
    (next: Sort) => {
      hapticSelection();
      if (next === 'nearest' && lat == null) void requestPermission();
      setSort(next);
    },
    [lat, requestPermission],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await requestPermission();
    setRefreshing(false);
  }, [requestPermission]);

  const filters = useMemo<{ key: Filter; label: string }[]>(
    () => [
      { key: 'all', label: t('explore.all') },
      ...PLACE_CATEGORIES.map((c) => ({ key: c, label: t(`categories.${c}`) })),
    ],
    [t],
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <StoneLattice patternId="explore-bg" color={colors.clay} opacity={0.05} tile={40} />
      <View style={styles.headerWrap}>
        <Text style={styles.title}>{t('explore.title')}</Text>
        <Text style={styles.subtitle}>{t('explore.subtitle')}</Text>
        <OrnamentDivider style={styles.headerDivider} />
      </View>

      <View style={[styles.searchBox, focused && styles.searchBoxFocused]}>
        <MaterialCommunityIcons name="magnify" size={20} color={focused ? colors.primary : colors.subtleText} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
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
                onPress={() => {
                  hapticSelection();
                  setFilter(f.key);
                }}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.toolbar}>
        <Text style={styles.resultCount}>{t('explore.results', { count: items.length })}</Text>
        <View style={styles.sortRow}>
          <Pressable
            onPress={() => selectSort('featured')}
            style={[styles.sortPill, sort === 'featured' && styles.sortPillActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: sort === 'featured' }}
          >
            <Text style={[styles.sortText, sort === 'featured' && styles.sortTextActive]}>
              {t('explore.sortFeatured')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => selectSort('nearest')}
            style={[styles.sortPill, sort === 'nearest' && styles.sortPillActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: sort === 'nearest' }}
          >
            <MaterialCommunityIcons
              name="map-marker-distance"
              size={14}
              color={sort === 'nearest' ? colors.onPrimary : colors.mutedText}
            />
            <Text style={[styles.sortText, sort === 'nearest' && styles.sortTextActive]}>
              {t('explore.sortNearest')}
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.place.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={
          !query && filter === 'all' ? (
            <StoryCard onPress={() => router.push('/story')} style={styles.storyHeader} />
          ) : null
        }
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.duration(280).delay(Math.min(index, 10) * 40)}>
            <PlaceCard
              place={item.place}
              completed={isPlaceCompleted(item.place.id)}
              distanceLabel={item.meters != null ? formatDistance(item.meters) : undefined}
              onPress={() => router.push(`/place/${item.place.id}`)}
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
  headerWrap: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
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
    marginTop: spacing.xs,
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
  searchBoxFocused: {
    borderColor: colors.primary,
    ...shadow.sm,
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
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  resultCount: {
    ...typography.caption,
    color: colors.subtleText,
  },
  sortRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortText: {
    ...typography.label,
    color: colors.mutedText,
  },
  sortTextActive: {
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
