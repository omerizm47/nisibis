import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useCity } from '@/hooks/useCity';
import { colors, gradients, radius, shadow, spacing, typography } from '@/theme';
import { withAlpha } from '@/utils/color';
import { hapticSelection } from '@/utils/haptics';
import { PatternBackdrop } from './Ornament';
import { PressableScale } from './PressableScale';
import { PrimaryButton } from './PrimaryButton';

interface CityInviteCardProps {
  /** `done` turu bitirene, `invite` yolun ortasındakine gösterilir. */
  variant: 'done' | 'invite';
  style?: StyleProp<ViewStyle>;
}

/** Bir şehri gezerken ya da bitirirken diğer şehri önerir. */
export function CityInviteCard({ variant, style }: CityInviteCardProps) {
  const { t } = useTranslation();
  const { city, otherCity, setCity } = useCity();

  const switchCity = () => {
    hapticSelection();
    setCity(otherCity.id);
  };

  const title =
    variant === 'done'
      ? t('crossCity.doneTitle', { city: city.name })
      : t('crossCity.inviteTitle', { other: otherCity.name });

  const body =
    variant === 'done'
      ? t('crossCity.doneBody', { other: otherCity.name, count: otherCity.places.length })
      : t('crossCity.inviteBody', {
          count: otherCity.places.length,
          routes: otherCity.routes.length,
          city: city.name,
        });

  return (
    <PressableScale
      onPress={switchCity}
      accessibilityRole="button"
      accessibilityLabel={t('crossCity.cta', { city: otherCity.name })}
      style={[styles.card, shadow.md, style]}
    >
      <LinearGradient
        colors={gradients.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <PatternBackdrop patternId="city-invite-stars" color={colors.primary} opacity={0.12} tile={38} />
      <View style={styles.head}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons
            name={variant === 'done' ? 'trophy-outline' : 'map-marker-multiple-outline'}
            size={22}
            color={colors.primary}
          />
        </View>
        <View style={styles.texts}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
        </View>
      </View>
      <PrimaryButton
        label={t('crossCity.cta', { city: otherCity.name })}
        icon="swap-horizontal"
        onPress={switchCity}
        style={styles.cta}
      />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: withAlpha(colors.primary, 0.35),
    overflow: 'hidden',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: withAlpha(colors.primary, 0.14),
    borderWidth: 1,
    borderColor: withAlpha(colors.primary, 0.3),
  },
  texts: {
    flex: 1,
    gap: 3,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  body: {
    ...typography.caption,
    color: colors.mutedText,
  },
  cta: {
    marginTop: spacing.xs,
  },
});
