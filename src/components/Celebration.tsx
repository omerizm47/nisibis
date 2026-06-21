import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Polygon } from 'react-native-svg';
import { useProgress } from '@/hooks';
import { colors, shadow, typography } from '@/theme';
import { withAlpha } from '@/utils/color';

interface CelebrateOptions {
  title?: string;
  big?: boolean;
}

const CelebrationContext = createContext<{ celebrate: (options?: CelebrateOptions) => void }>({
  celebrate: () => undefined,
});

export function useCelebration() {
  return useContext(CelebrationContext);
}

/** Sekiz köşeli yıldız (kültürel motif) köşe noktaları. */
function star8(size: number): string {
  const c = size / 2;
  const outer = size / 2;
  const inner = size * 0.21;
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i * Math.PI) / 8 - Math.PI / 2;
    pts.push(`${(c + r * Math.cos(a)).toFixed(2)},${(c + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

const PARTICLE_COLORS = [colors.primary, colors.sand, colors.info, colors.clay, colors.success];

function Particle({ angle, distance, color, delay }: { angle: number; distance: number; color: string; delay: number }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(delay, withTiming(1, { duration: 720, easing: Easing.out(Easing.quad) }));
  }, [p, delay]);
  const style = useAnimatedStyle(() => ({
    opacity: p.value < 0.12 ? p.value / 0.12 : 1 - (p.value - 0.12) / 0.88,
    transform: [
      { translateX: Math.cos(angle) * distance * p.value },
      { translateY: Math.sin(angle) * distance * p.value },
      { scale: 0.5 + 0.7 * (1 - p.value) },
      { rotate: `${45 + p.value * 200}deg` },
    ],
  }));
  return <Animated.View style={[styles.particle, { backgroundColor: color }, style]} />;
}

function Burst({ big, title, onDone }: { big: boolean; title?: string; onDone: () => void }) {
  const appear = useSharedValue(0);
  const medal = useSharedValue(0);
  const count = big ? 14 : 9;
  const distance = big ? 124 : 86;
  const medalSize = big ? 110 : 88;

  useEffect(() => {
    const duration = big ? 2200 : 1250;
    appear.value = withSequence(
      withTiming(1, { duration: 180 }),
      withDelay(duration - 480, withTiming(0, { duration: 300 })),
    );
    medal.value = withSequence(
      withSpring(1.12, { damping: 8, stiffness: 170 }),
      withSpring(1, { damping: 13, stiffness: 200 }),
    );
    const id = setTimeout(onDone, duration);
    return () => clearTimeout(id);
  }, [appear, medal, big, onDone]);

  const scrimStyle = useAnimatedStyle(() => ({ opacity: appear.value * (big ? 0.5 : 0.26) }));
  const medalStyle = useAnimatedStyle(() => ({ opacity: appear.value, transform: [{ scale: medal.value }] }));

  return (
    <View style={styles.overlay}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.scrim, scrimStyle]} />
      <View style={styles.center}>
        <View style={styles.burstBox}>
          {Array.from({ length: count }).map((_, i) => (
            <Particle
              key={i}
              angle={(i / count) * Math.PI * 2}
              distance={distance}
              color={PARTICLE_COLORS[i % PARTICLE_COLORS.length]}
              delay={i * 12}
            />
          ))}
          <Animated.View style={[styles.medal, shadow.gold, medalStyle]}>
            <Svg width={medalSize} height={medalSize}>
              <Polygon points={star8(medalSize)} fill={colors.primary} />
            </Svg>
            <View style={StyleSheet.absoluteFill}>
              <View style={styles.checkWrap}>
                <MaterialCommunityIcons name="check-bold" size={big ? 40 : 32} color={colors.onPrimary} />
              </View>
            </View>
          </Animated.View>
        </View>
        {title ? (
          <Animated.View entering={FadeInDown.duration(360).delay(180)} style={styles.titleWrap}>
            <Text style={styles.title}>{title}</Text>
          </Animated.View>
        ) : null}
      </View>
    </View>
  );
}

/** Tur %100 olduğunda büyük kutlamayı tetikler. */
function MilestoneWatcher() {
  const { t } = useTranslation();
  const { percent, loaded } = useProgress();
  const { celebrate } = useCelebration();
  const prev = useRef(percent);
  useEffect(() => {
    if (loaded && prev.current < 100 && percent === 100) {
      celebrate({ big: true, title: t('progress.tourComplete') });
    }
    prev.current = percent;
  }, [percent, loaded, celebrate, t]);
  return null;
}

export function CelebrationProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<{ key: number; big: boolean; title?: string } | null>(null);

  const celebrate = useCallback((options?: CelebrateOptions) => {
    if (Platform.OS !== 'web') {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setActive({ key: Date.now(), big: !!options?.big, title: options?.title });
  }, []);

  return (
    <CelebrationContext.Provider value={{ celebrate }}>
      <MilestoneWatcher />
      {children}
      {active ? (
        <Burst key={active.key} big={active.big} title={active.title} onDone={() => setActive(null)} />
      ) : null}
    </CelebrationContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 50,
  },
  scrim: {
    backgroundColor: colors.scrim,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  burstBox: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    top: 115,
    left: 115,
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  medal: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    marginTop: 4,
    maxWidth: 280,
    backgroundColor: colors.card,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: withAlpha(colors.primary, 0.35),
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  title: {
    ...typography.title,
    color: colors.primary,
    textAlign: 'center',
  },
});
