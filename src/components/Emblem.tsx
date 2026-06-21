import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Path, Polygon, Rect } from 'react-native-svg';
import { colors } from '@/theme';

function star8(cx: number, cy: number, outer: number, inner: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i * Math.PI) / 8 - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

interface EmblemProps {
  size?: number;
  /** Ana yapı rengi (kilise/minare gövdesi, kemer). */
  color?: string;
  /** Vurgu rengi (yıldız, haç, alem) — iki tonlu görünüm için. */
  accent?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Nusaybin'in simgesi: yan yana yükselen kilise (çan kulesi + haç) ve cami
 * (minare + alem), birleştirici sekiz köşeli yıldız ve Mardin sivri kemeri.
 * Bir arada yaşamın amblemi.
 */
export function Emblem({ size = 96, color = colors.primary, accent, style }: EmblemProps) {
  const a = accent ?? color;
  return (
    <View style={style}>
      <Svg width={size} height={(size * 112) / 120} viewBox="0 0 120 112">
        {/* Mardin sivri kemeri */}
        <Path
          d="M18 108 L18 54 Q18 18 60 12 Q102 18 102 54 L102 108"
          stroke={color}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
        {/* zemin */}
        <Rect x={24} y={100} width={72} height={3} rx={1.5} fill={color} />

        {/* kilise: çan kulesi + haç */}
        <Polygon points="30,60 54,60 42,44" fill={color} />
        <Rect x={34} y={60} width={16} height={40} fill={color} />
        <Rect x={36.5} y={74} width={11} height={9} rx={1} fill={a} opacity={0.0} />
        <Rect x={41} y={31} width={2} height={13} rx={1} fill={a} />
        <Rect x={37} y={35} width={10} height={2} rx={1} fill={a} />

        {/* cami: minare + alem */}
        <Polygon points="72,47 80,47 76,33" fill={color} />
        <Rect x={72} y={47} width={8} height={53} fill={color} />
        <Rect x={68.5} y={65} width={15} height={4} rx={1} fill={color} />
        <Circle cx={76} cy={29.5} r={2.6} fill={a} />

        {/* birleştirici yıldız */}
        <Polygon points={star8(60, 27, 8.5, 3.6)} fill={a} />
      </Svg>
    </View>
  );
}
