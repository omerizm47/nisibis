import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, Pattern, Polygon, Rect } from 'react-native-svg';
import { colors } from '@/theme';

function octagon(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 8; i++) {
    const a = ((i * 45 + 22.5) * Math.PI) / 180;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

interface StoneLatticeProps {
  patternId?: string;
  color?: string;
  opacity?: number;
  tile?: number;
  style?: StyleProp<ViewStyle>;
}

/** Mardin taş kafesi (şebeke) — sekizgen örgü dokusu, hero/kart arka planı. */
export function StoneLattice({
  patternId = 'nis-lattice',
  color = colors.clay,
  opacity = 0.12,
  tile = 38,
  style,
}: StoneLatticeProps) {
  const c = tile / 2;
  return (
    <View style={[StyleSheet.absoluteFill, styles.noEvents, style]}>
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id={patternId} width={tile} height={tile} patternUnits="userSpaceOnUse">
            <Polygon
              points={octagon(c, c, tile * 0.5)}
              fill="none"
              stroke={color}
              strokeWidth={1}
              strokeOpacity={opacity}
            />
            <Polygon
              points={octagon(c, c, tile * 0.26)}
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

interface KilimBandProps {
  patternId?: string;
  color?: string;
  accent?: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

/** Kilim/şerit bordürü — bölüm ayraçları için yatay geometrik bant. */
export function KilimBand({
  patternId = 'nis-kilim',
  color = colors.clay,
  accent,
  height = 16,
  style,
}: KilimBandProps) {
  const a = accent ?? color;
  const t = 26;
  const h = height;
  return (
    <View style={[{ height: h }, styles.noEvents, style]}>
      <Svg width="100%" height={h}>
        <Defs>
          <Pattern id={patternId} width={t} height={h} patternUnits="userSpaceOnUse">
            <Polygon
              points={`${t / 2},1.5 ${t - 1.5},${h / 2} ${t / 2},${h - 1.5} 1.5,${h / 2}`}
              fill="none"
              stroke={color}
              strokeWidth={1.2}
            />
            <Polygon
              points={`${t / 2},${h / 2 - 2.8} ${t / 2 + 2.8},${h / 2} ${t / 2},${h / 2 + 2.8} ${t / 2 - 2.8},${h / 2}`}
              fill={a}
            />
            <Polygon
              points={`0,${h / 2 - 2.8} 2.8,${h / 2} 0,${h / 2 + 2.8} -2.8,${h / 2}`}
              fill={a}
            />
            <Polygon
              points={`${t},${h / 2 - 2.8} ${t + 2.8},${h / 2} ${t},${h / 2 + 2.8} ${t - 2.8},${h / 2}`}
              fill={a}
            />
          </Pattern>
        </Defs>
        <Rect width="100%" height={h} fill={`url(#${patternId})`} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  noEvents: {
    pointerEvents: 'none',
  },
});
