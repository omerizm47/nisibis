import { useEffect, useMemo, useRef, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, UrlTile } from '@/components/PlatformMap';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomPlaceSheet, LoadingState, ProgressRing } from '@/components';
import { getMarkerImageSource } from '@/components/MapMarker';
import { getAllPlaces, getPlaceById, getRouteById, getRoutePlaces, useLocation, useProgress } from '@/hooks';
import type { Place, TourRoute } from '@/types';
import { colors, radius, shadow, spacing, typography } from '@/theme';
import { DEFAULT_REGION, MAP_ATTRIBUTION, MAP_STYLE, MAP_TILE_URL } from '@/utils/constants';
import { withAlpha } from '@/utils/color';
import { hapticLight } from '@/utils/haptics';
import { openDirections } from '@/utils/links';
import type { MciName } from '@/utils/icons';
import {
  getDisplayCoordinate,
  regionForCoordinate,
  regionForPlaces,
} from '@/utils/map';

function MapPill({ icon, label, onPress }: { icon: MciName; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.pill, pressed && styles.pressed]}
    >
      <MaterialCommunityIcons name={icon} size={16} color={colors.primary} />
      <Text style={styles.pillText}>{label}</Text>
    </Pressable>
  );
}

export default function MapScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  const places = useMemo(() => getAllPlaces().filter((p) => getDisplayCoordinate(p) != null), []);
  const initialRegion = DEFAULT_REGION;
  const mosaicLink = useMemo(() => {
    const church = getPlaceById('mor-yakup-kilisesi');
    const mosque = getPlaceById('zeynel-abidin-camii');
    const a = church ? getDisplayCoordinate(church) : null;
    const b = mosque ? getDisplayCoordinate(mosque) : null;
    return a && b ? [a, b] : null;
  }, []);

  const { location, permission, requestPermission } = useLocation();
  const { percent, isPlaceCompleted, togglePlaceVisited } = useProgress();
  const [selected, setSelected] = useState<Place | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [routeId, setRouteId] = useState<string | null>(null);
  const params = useLocalSearchParams<{ focus?: string; route?: string }>();

  const activeRoute = useMemo<TourRoute | null>(
    () => (routeId ? getRouteById(routeId) ?? null : null),
    [routeId],
  );
  const routeCoords = useMemo(
    () =>
      activeRoute
        ? getRoutePlaces(activeRoute)
            .map((p) => getDisplayCoordinate(p))
            .filter((c): c is { latitude: number; longitude: number } => c != null)
        : [],
    [activeRoute],
  );

  const focus = (coord: { latitude: number; longitude: number }, delta = 0.02) => {
    mapRef.current?.animateToRegion(regionForCoordinate(coord, delta), 600);
  };

  useEffect(() => {
    if (!params.focus) return;
    const target = getPlaceById(params.focus);
    if (!target) return;
    const coord = getDisplayCoordinate(target);
    if (coord) {
      setSelected(target);
      mapRef.current?.animateToRegion(regionForCoordinate(coord, 0.01), 600);
    }
  }, [params.focus]);

  useEffect(() => {
    if (!params.route) return;
    const r = getRouteById(params.route);
    if (!r) return;
    setRouteId(params.route);
    setSelected(null);
    mapRef.current?.animateToRegion(regionForPlaces(getRoutePlaces(r)), 700);
  }, [params.route]);

  useEffect(() => {
    const timer = setTimeout(() => setMapReady(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleMarkerPress = (place: Place) => {
    setSelected(place);
    const coord = getDisplayCoordinate(place);
    if (coord) focus(coord, 0.02);
  };

  const handleDirections = (place: Place) => {
    const coord = getDisplayCoordinate(place);
    if (!coord) return;
    hapticLight();
    void openDirections(coord);
  };

  const clearRoute = () => {
    hapticLight();
    setRouteId(null);
    router.setParams({ route: '' });
    mapRef.current?.animateToRegion(initialRegion, 500);
  };

  const handleDetails = (place: Place) => {
    setSelected(null);
    router.push(`/place/${place.id}`);
  };

  const handleNearby = () => {
    if (location) {
      focus({ latitude: location.latitude, longitude: location.longitude }, 0.02);
    } else if (permission !== 'granted') {
      void requestPermission();
    } else {
      mapRef.current?.animateToRegion(initialRegion, 600);
    }
  };

  const handleRecenter = () => {
    if (location) {
      focus({ latitude: location.latitude, longitude: location.longitude }, 0.01);
    } else {
      void requestPermission();
    }
  };

  const handleMapReady = () => {
    setMapReady(true);
    if (params.route) {
      const r = getRouteById(params.route);
      if (r) {
        mapRef.current?.animateToRegion(regionForPlaces(getRoutePlaces(r)), 0);
        return;
      }
    }
    if (!params.focus) {
      mapRef.current?.animateToRegion(initialRegion, 0);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        onMapReady={handleMapReady}
        customMapStyle={MAP_STYLE}
        showsPointsOfInterest={false}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        showsCompass={false}
      >
        <UrlTile urlTemplate={MAP_TILE_URL} maximumZ={19} flipY={false} zIndex={-1} />
        {!activeRoute && mosaicLink ? (
          <Polyline
            coordinates={mosaicLink}
            strokeColor={colors.primary}
            strokeWidth={2}
            lineDashPattern={[6, 6]}
          />
        ) : null}
        {routeCoords.length >= 2 ? (
          <>
            <Polyline
              coordinates={routeCoords}
              strokeColor={withAlpha(colors.primary, 0.22)}
              strokeWidth={12}
              lineCap="round"
              lineJoin="round"
            />
            <Polyline
              coordinates={routeCoords}
              strokeColor={colors.primary}
              strokeWidth={4}
              lineCap="round"
              lineJoin="round"
            />
          </>
        ) : null}
        {places.map((place) => {
          const coord = getDisplayCoordinate(place);
          if (!coord) return null;
          return (
            <Marker
              key={place.id}
              coordinate={coord}
              onPress={() => handleMarkerPress(place)}
              anchor={{ x: 0.5, y: 0.5 }}
              image={getMarkerImageSource(place.category, isPlaceCompleted(place.id))}
            />
          );
        })}
        {location ? (
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            anchor={{ x: 0.5, y: 0.5 }}
            flat
            tracksViewChanges={false}
          >
            <View style={styles.userDot}>
              <View style={styles.userDotCore} />
            </View>
          </Marker>
        ) : null}
      </MapView>

      <View style={[StyleSheet.absoluteFill, { pointerEvents: 'box-none' }]}>
        <View style={[styles.topBar, { marginTop: insets.top + spacing.sm }]}>
          <View style={styles.topLeft}>
            <View style={styles.brandBlock}>
              <Text style={styles.brand}>{t('app.name')}</Text>
              <Text style={styles.tagline}>{t('app.tagline')}</Text>
            </View>
            <Pressable
              onPress={() => router.push('/story')}
              accessibilityRole="button"
              accessibilityLabel={t('story.shortcut')}
              style={({ pressed }) => [styles.storyChip, pressed && styles.pressed]}
            >
              <MaterialCommunityIcons name="book-open-page-variant-outline" size={14} color={colors.primary} />
              <Text style={styles.storyChipText}>{t('story.shortcut')}</Text>
            </Pressable>
          </View>
          <Pressable
            onPress={() => router.push('/checklist')}
            accessibilityRole="button"
            accessibilityLabel={t('progress.tourProgress')}
            style={({ pressed }) => [styles.progressChip, shadow.md, pressed && styles.pressed]}
          >
            <ProgressRing percent={percent} size={42} strokeWidth={5}>
              <Text style={styles.progressChipText}>{percent}%</Text>
            </ProgressRing>
          </Pressable>
        </View>

        {activeRoute ? (
          <Pressable
            onPress={() => router.push(`/route/${activeRoute.id}`)}
            accessibilityRole="button"
            style={[styles.routeBanner, shadow.md]}
          >
            <View style={styles.routeBannerIcon}>
              <MaterialCommunityIcons name="map-marker-path" size={18} color={colors.onPrimary} />
            </View>
            <View style={styles.routeBannerTexts}>
              <Text style={styles.routeBannerTitle} numberOfLines={1}>
                {activeRoute.title}
              </Text>
              <Text style={styles.routeBannerMeta}>
                {t('routes.stops', { count: activeRoute.poiIds.length })}
              </Text>
            </View>
            <Pressable
              onPress={clearRoute}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
              style={styles.routeBannerClose}
            >
              <MaterialCommunityIcons name="close" size={18} color={colors.mutedText} />
            </Pressable>
          </Pressable>
        ) : null}

        <View style={{ flex: 1 }} />

        <View style={[styles.bottomBar, { marginBottom: spacing.lg }]}>
          <View style={styles.attributionWrap}>
            <Text style={styles.attribution}>{MAP_ATTRIBUTION}</Text>
          </View>
          <View style={styles.controlsRow}>
            <View style={styles.pills}>
              <MapPill icon="crosshairs-gps" label={t('map.nearby')} onPress={handleNearby} />
              <MapPill icon="map-marker-path" label={t('map.dailyRoute')} onPress={() => router.push('/routes')} />
            </View>
            <Pressable
              onPress={handleRecenter}
              accessibilityRole="button"
              accessibilityLabel={t('map.recenter')}
              style={({ pressed }) => [styles.fab, shadow.gold, pressed && styles.pressed]}
            >
              <MaterialCommunityIcons name="crosshairs-gps" size={22} color={colors.onPrimary} />
            </Pressable>
          </View>

          {permission === 'denied' ? (
            <Pressable
              onPress={() => void requestPermission()}
              accessibilityRole="button"
              style={styles.locationHint}
            >
              <MaterialCommunityIcons name="map-marker-alert-outline" size={16} color={colors.mutedText} />
              <Text style={styles.locationHintText}>{t('map.enableLocation')}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {!mapReady ? (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <LoadingState label={t('map.loadingMap')} />
        </View>
      ) : null}

      <BottomPlaceSheet
        place={selected}
        completed={selected ? isPlaceCompleted(selected.id) : false}
        onClose={() => setSelected(null)}
        onDetails={handleDetails}
        onDirections={handleDirections}
        onToggleComplete={(place) => togglePlaceVisited(place.id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mapBackground,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  userDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: withAlpha(colors.indigo, 0.22),
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDotCore: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: colors.indigo,
    borderWidth: 2,
    borderColor: colors.onPrimary,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  brandBlock: {
    backgroundColor: withAlpha(colors.background, 0.7),
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  brand: {
    ...typography.h2,
    color: colors.primary,
  },
  tagline: {
    ...typography.caption,
    color: colors.mutedText,
  },
  topLeft: {
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  storyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: withAlpha(colors.background, 0.7),
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: withAlpha(colors.primary, 0.4),
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  storyChipText: {
    ...typography.label,
    color: colors.primary,
  },
  progressChip: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressChipText: {
    ...typography.overline,
    color: colors.text,
  },
  routeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: withAlpha(colors.primary, 0.35),
  },
  routeBannerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  routeBannerTexts: {
    flex: 1,
  },
  routeBannerTitle: {
    ...typography.subtitle,
    color: colors.text,
  },
  routeBannerMeta: {
    ...typography.caption,
    color: colors.mutedText,
  },
  routeBannerClose: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardAlt,
  },
  bottomBar: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  attributionWrap: {
    alignSelf: 'flex-start',
    backgroundColor: withAlpha(colors.background, 0.6),
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  attribution: {
    fontSize: 10,
    color: colors.subtleText,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    flex: 1,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  pillText: {
    ...typography.label,
    color: colors.text,
  },
  fab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  locationHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  locationHintText: {
    ...typography.caption,
    color: colors.mutedText,
  },
  pressed: {
    opacity: 0.9,
  },
});
