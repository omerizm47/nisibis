import { useCallback, useEffect, useMemo, useRef } from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import type { Place } from '@/types';
import { getPlaceImageSource } from '@/data/placeImages';
import { colors, gradients, radius, spacing, typography } from '@/theme';
import { CategoryBadge } from './CategoryBadge';
import { PrimaryButton } from './PrimaryButton';
import { RemoteImage } from './RemoteImage';

interface BottomPlaceSheetProps {
  place: Place | null;
  completed: boolean;
  onClose: () => void;
  onDetails: (place: Place) => void;
  onDirections: (place: Place) => void;
  onToggleComplete: (place: Place) => void;
}

export function BottomPlaceSheet({
  place,
  completed,
  onClose,
  onDetails,
  onDirections,
  onToggleComplete,
}: BottomPlaceSheetProps) {
  const { t } = useTranslation();
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['58%'], []);

  useEffect(() => {
    if (place) {
      sheetRef.current?.snapToIndex(0);
    } else {
      sheetRef.current?.close();
    }
  }, [place]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.55} />
    ),
    [],
  );

  const handleChange = useCallback(
    (index: number) => {
      if (index === -1 && place) {
        onClose();
      }
    },
    [onClose, place],
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onChange={handleChange}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetView style={styles.content}>
        {place ? (
          <>
            <View style={styles.imageWrap}>
              <RemoteImage source={getPlaceImageSource(place)} style={StyleSheet.absoluteFill} />
              <LinearGradient colors={gradients.imageScrim} style={StyleSheet.absoluteFill} />
              <View style={styles.badge}>
                <CategoryBadge category={place.category} />
              </View>
            </View>

            <Text style={styles.title} numberOfLines={2}>
              {place.name}
            </Text>
            <Text style={styles.desc} numberOfLines={3}>
              {place.shortDescription}
            </Text>

            <View style={styles.metaRow}>
              <MaterialCommunityIcons name="clock-outline" size={15} color={colors.subtleText} />
              <Text style={styles.metaText}>
                {t('place.estimatedVisit')}: {t('common.minutes', { count: place.estimatedVisitMinutes })}
              </Text>
            </View>

            <View style={styles.actionsRow}>
              <PrimaryButton
                label={t('place.directions')}
                icon="directions"
                variant="secondary"
                onPress={() => onDirections(place)}
                style={styles.flexBtn}
              />
              <PrimaryButton
                label={t('place.details')}
                icon="arrow-right"
                onPress={() => onDetails(place)}
                style={styles.flexBtn}
              />
            </View>
            <PrimaryButton
              label={completed ? t('place.markedComplete') : t('place.markComplete')}
              icon={completed ? 'check-circle' : 'check-circle-outline'}
              variant="ghost"
              onPress={() => onToggleComplete(place)}
            />
          </>
        ) : null}
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.x2l,
    borderTopRightRadius: radius.x2l,
  },
  handle: {
    backgroundColor: colors.borderStrong,
    width: 44,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.x2l,
    gap: spacing.sm,
  },
  imageWrap: {
    height: 150,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.xs,
  },
  desc: {
    ...typography.body,
    color: colors.mutedText,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    ...typography.caption,
    color: colors.subtleText,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  flexBtn: {
    flex: 1,
  },
});
