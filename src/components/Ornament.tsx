import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, Pattern, Polygon, Rect } from 'react-native-svg';
import { colors } from '@/theme';
import { withAlpha } from '@/utils/color';

/** Sekiz köşeli yıldız (Anadolu/İslami geometrik motif) köşe noktaları. */
function starPoints(cx: number, cy: number, outer: number, inner: number, points = 8): string {
  const step = Math.PI / points;
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = i * step - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

interface PatternBackdropProps {
  /** Aynı ekranda birden fazla kullanılıyorsa benzersiz olmalı. */
  patternId?: string;
  color?: string;
  opacity?: number;
  tile?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Sekiz köşeli yıldız mozaiğinin tekrarlandığı ince doku katmanı.
 * Hero/kart arka planlarında kültürel zenginlik için kullanılır.
 */
export function PatternBackdrop({
  patternId = 'nisibis-stars',
  color = colors.primary,
  opacity = 0.1,
  tile = 44,
  style,
}: PatternBackdropProps) {
  const c = tile / 2;
  return (
    <View style={[StyleSheet.absoluteFill, styles.noEvents, style]}>
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id={patternId} width={tile} height={tile} patternUnits="userSpaceOnUse">
            <Polygon
              points={starPoints(c, c, tile * 0.32, tile * 0.14)}
              fill="none"
              stroke={color}
              strokeWidth={1}
              strokeOpacity={opacity}
            />
            <Polygon
              points={starPoints(0, 0, tile * 0.32, tile * 0.14)}
              fill="none"
              stroke={color}
              strokeWidth={1}
              strokeOpacity={opacity}
            />
            <Polygon
              points={starPoints(tile, tile, tile * 0.32, tile * 0.14)}
              fill="none"
              stroke={color}
              strokeWidth={1}
              strokeOpacity={opacity}
            />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </Svg>
    </View>
  );
}

interface OrnamentDividerProps {
  color?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Kültürel bölüm ayracı: iki ince çizgi arasında sekiz köşeli yıldız madalyon.
 */
export function OrnamentDivider({ color = colors.clay, style }: OrnamentDividerProps) {
  return (
    <View style={[styles.dividerWrap, style]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={[styles.line, { backgroundColor: withAlpha(color, 0.45) }]} />
      <Svg width={24} height={24}>
        <Polygon points={starPoints(12, 12, 11, 4.6)} fill="none" stroke={color} strokeWidth={1.4} />
        <Polygon points={starPoints(12, 12, 4.4, 1.8)} fill={color} />
      </Svg>
      <View style={[styles.line, { backgroundColor: withAlpha(color, 0.45) }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  noEvents: {
    pointerEvents: 'none',
  },
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
});
