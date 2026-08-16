import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '@/theme';

interface ArchFrameProps {
  children?: ReactNode;
  /** Kemerin üstündeki köşeleri dolduran renk = görselin arkasındaki yüzey. */
  archColor?: string;
  /** Kemer bandının yüksekliği (px). */
  archHeight?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Mardin sivri kemeri biçiminde tepe maskesi. Görselin üst köşelerini
 * yüzey rengiyle doldurarak görseli kemerli bir pencereye dönüştürür.
 */
export function ArchFrame({
  children,
  archColor = colors.background,
  archHeight = 54,
  style,
}: ArchFrameProps) {
  const h = archHeight;
  // Köşe kendi en boy oranını korur. Tek svg'yi genişliğe yaymak, eğriyi geniş
  // ekranda 7 kat yatay geriyor ve kemer yerine sığ bir mercek çiziyordu.
  const w = Math.round(h * 1.6);
  return (
    <View style={[styles.wrap, style]}>
      {children}
      <View style={[styles.overlay, { height: h }]}>
        <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={styles.left}>
          <Path d={`M0 0 L${w} 0 Q0 0 0 ${h} Z`} fill={archColor} />
        </Svg>
        <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={styles.right}>
          <Path d={`M${w} 0 L0 0 Q${w} 0 ${w} ${h} Z`} fill={archColor} />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    pointerEvents: 'none',
  },
  left: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  right: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});
