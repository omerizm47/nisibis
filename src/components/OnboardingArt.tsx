import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Ellipse, Path, Polygon } from 'react-native-svg';
import { colors } from '@/theme';
import { withAlpha } from '@/utils/color';
import { Emblem } from './Emblem';

function star8(cx: number, cy: number, outer: number, inner: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i * Math.PI) / 8 - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

const ARCH = 'M20 196 L20 86 Q20 22 90 16 Q160 22 160 86 L160 196 Z';

interface OnboardingArtProps {
  /** 0 = karşılama (amblem), 1 = keşif (pusula), 2 = konum (iğne). */
  step: number;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

/** Mardin kemeri biçiminde bir niş içinde, her adıma özel kültürel illüstrasyon. */
export function OnboardingArt({ step, size = 210, style }: OnboardingArtProps) {
  const height = size * (200 / 180);
  return (
    <View style={[{ width: size, height }, style]}>
      <Svg style={StyleSheet.absoluteFill} viewBox="0 0 180 200" preserveAspectRatio="xMidYMid meet">
        <Path d={ARCH} fill={colors.cardAlt} />
        <Polygon points={star8(90, 104, 58, 25)} fill={withAlpha(colors.primary, 0.07)} />
        <Path d={ARCH} stroke={colors.copper} strokeWidth={2.5} fill="none" strokeLinejoin="round" />
        <Polygon points="90,8 98,16 90,24 82,16" fill={colors.copper} />
        <Polygon points="90,11.5 95,16 90,20.5 85,16" fill={colors.cardAlt} />
        <Path d="M34 178 L146 178" stroke={colors.copper} strokeWidth={3} strokeLinecap="round" />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center]}>
        <View style={styles.sceneNudge}>{scene(step, size * 0.52)}</View>
      </View>
    </View>
  );
}

function scene(step: number, s: number) {
  if (step === 0) {
    return <Emblem size={s} color={colors.primary} accent={colors.copper} />;
  }
  if (step === 1) {
    // Pusula gülü (keşif)
    return (
      <Svg width={s} height={s} viewBox="0 0 100 100">
        <Circle cx={50} cy={50} r={36} stroke={colors.primary} strokeWidth={2.5} fill="none" />
        <Circle cx={50} cy={50} r={36} stroke={colors.copper} strokeWidth={2.5} fill="none" strokeDasharray="2 7" />
        <Polygon points={star8(50, 50, 31, 11)} fill={colors.primary} />
        <Polygon points="50,19 55,50 50,50 45,50" fill={colors.pomegranate} />
        <Circle cx={50} cy={50} r={6} fill={colors.cardAlt} />
        <Circle cx={50} cy={50} r={2.6} fill={colors.copper} />
      </Svg>
    );
  }
  // step 2: Konum iğnesi + radar (konum izni)
  return (
    <Svg width={s} height={s} viewBox="0 0 100 100">
      <Ellipse cx={50} cy={82} rx={30} ry={8} stroke={withAlpha(colors.primary, 0.28)} strokeWidth={2} fill="none" />
      <Ellipse cx={50} cy={82} rx={17} ry={4.5} stroke={withAlpha(colors.primary, 0.4)} strokeWidth={2} fill="none" />
      <Path
        d="M50 16 C36 16 28 27 28 39 C28 55 50 80 50 80 C50 80 72 55 72 39 C72 27 64 16 50 16 Z"
        fill={colors.primary}
      />
      <Circle cx={50} cy={39} r={11} fill={colors.cardAlt} />
      <Polygon points={star8(50, 39, 7.5, 3.2)} fill={colors.copper} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sceneNudge: {
    marginTop: '8%',
  },
});
