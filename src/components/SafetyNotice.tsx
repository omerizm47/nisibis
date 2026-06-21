import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';
import { withAlpha } from '@/utils/color';

interface SafetyNoticeProps {
  notes: string[];
  title?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Nazik "Ziyaret Notları" kartı (ibadet görgüsü, ziyaret saatleri, fotoğraf nezaketi).
 * Bilgilendirici/yumuşak tonludur.
 */
export function SafetyNotice({ notes, title, style }: SafetyNoticeProps) {
  const { t } = useTranslation();
  if (!notes || notes.length === 0) return null;

  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="information-outline" size={18} color={colors.info} />
        <Text style={styles.title}>{title ?? t('place.visitNotes')}</Text>
      </View>
      <View style={styles.list}>
        {notes.map((note, index) => (
          <View key={`${index}-${note.slice(0, 12)}`} style={styles.item}>
            <View style={styles.dot} />
            <Text style={styles.note}>{note}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: withAlpha(colors.info, 0.08),
    borderWidth: 1,
    borderColor: withAlpha(colors.info, 0.24),
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.label,
    color: colors.info,
  },
  list: {
    gap: spacing.xs,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.info,
    marginTop: 8,
  },
  note: {
    ...typography.body,
    color: colors.mutedText,
    flex: 1,
  },
});
