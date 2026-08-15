import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { getPlaceImages } from '@/data/placeImages';
import type { Place } from '@/types';
import { colors, radius, spacing } from '@/theme';
import { withAlpha } from '@/utils/color';
import { RemoteImage } from './RemoteImage';

interface PlaceGalleryProps {
  place: Place;
  /** Kaydırıldıkça aktif görselin sırası; künye satırı bunu izler. */
  onIndexChange?: (index: number) => void;
  style?: StyleProp<ViewStyle>;
}

/** Mekanın görsellerini yatay kaydırmalı, sayfa sayfa gösterir. */
export function PlaceGallery({ place, onIndexChange, style }: PlaceGalleryProps) {
  const images = getPlaceImages(place);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [index, setIndex] = useState(0);

  const onLayout = (e: LayoutChangeEvent) =>
    setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height });

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!size.width) return;
    const next = Math.round(e.nativeEvent.contentOffset.x / size.width);
    if (next !== index && next >= 0 && next < images.length) {
      setIndex(next);
      onIndexChange?.(next);
    }
  };

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <View style={[styles.fill, style]} onLayout={onLayout}>
        <RemoteImage source={images[0].source} style={StyleSheet.absoluteFill} />
      </View>
    );
  }

  return (
    <View style={[styles.fill, style]} onLayout={onLayout}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={StyleSheet.absoluteFill}
      >
        {size.width > 0
          ? images.map((img, i) => (
              <View key={i} style={{ width: size.width, height: size.height }}>
                <RemoteImage source={img.source} style={StyleSheet.absoluteFill} />
              </View>
            ))
          : null}
      </ScrollView>
      <View style={styles.dotsWrap} pointerEvents="none">
        <View style={styles.dots}>
          {images.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFillObject,
  },
  dotsWrap: {
    position: 'absolute',
    bottom: spacing.lg,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: withAlpha(colors.text, 0.45),
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: withAlpha(colors.onPrimary, 0.5),
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.onPrimary,
  },
});
