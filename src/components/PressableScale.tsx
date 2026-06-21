import type { ReactNode } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Basıldığında küçülme oranı. */
  scaleTo?: number;
  /** Dokunuşta hafif titreşim (yalnızca native). */
  haptic?: boolean;
}

/**
 * Premium dokunsal his için yaylı (spring) ölçek geri bildirimi + hafif titreşim
 * veren basılabilir sarmalayıcı. Kartlarda opaklık yerine kullanılır.
 */
export function PressableScale({
  children,
  style,
  scaleTo = 0.97,
  haptic = true,
  onPress,
  ...rest
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(scaleTo, { mass: 0.5, damping: 18, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { mass: 0.5, damping: 15, stiffness: 260 });
      }}
      onPress={(e) => {
        if (haptic && Platform.OS !== 'web') {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.(e);
      }}
      style={[animatedStyle, style]}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}
