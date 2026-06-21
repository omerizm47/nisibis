import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, gradients, radius, shadow, spacing, typography } from '@/theme';
import { withAlpha } from '@/utils/color';
import { upperLocale } from '@/utils/text';
import { isRtl } from '@/utils/rtl';
import { PatternBackdrop } from './Ornament';
import { PressableScale } from './PressableScale';

interface StoryCardProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

/** "Nusaybin'in Hikâyesi" giriş kartı — kültür mozaiği anlatısına yönlendirir. */
export function StoryCard({ onPress, style }: StoryCardProps) {
  const { t, i18n } = useTranslation();
  const rtl = isRtl(i18n.language);
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.card, shadow.md, style]}
    >
      <LinearGradient
        colors={gradients.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <PatternBackdrop patternId="story-card-stars" color={colors.primary} opacity={0.14} tile={38} />
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name="book-open-page-variant-outline" size={22} color={colors.primary} />
      </View>
      <View style={styles.body}>
        <Text style={styles.overline}>{upperLocale(t('story.title'), i18n.language)}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {t('story.cardTitle')}
        </Text>
        <Text style={styles.desc} numberOfLines={2}>
          {t('story.cardBody')}
        </Text>
      </View>
      <MaterialCommunityIcons name={rtl ? 'chevron-left' : 'chevron-right'} size={22} color={colors.subtleText} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: withAlpha(colors.primary, 0.35),
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.92,
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
  body: {
    flex: 1,
    gap: 2,
  },
  overline: {
    ...typography.overline,
    color: colors.primary,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  desc: {
    ...typography.caption,
    color: colors.mutedText,
  },
});
