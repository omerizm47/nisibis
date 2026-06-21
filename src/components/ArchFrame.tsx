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
  const d = `M0 0 L50 0 Q0 0 0 ${h} Z M100 0 L50 0 Q100 0 100 ${h} Z`;
  return (
    <View style={[styles.wrap, style]}>
      {children}
      <View style={[styles.overlay, { height: h }]}>
        <Svg width="100%" height="100%" viewBox={`0 0 100 ${h}`} preserveAspectRatio="none">
          <Path d={d} fill={archColor} />
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
});
