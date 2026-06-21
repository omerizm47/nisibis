import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboarding } from '@/hooks/useOnboarding';
import { colors, fontFamily } from '@/theme';
import { withAlpha } from '@/utils/color';
import type { MciName } from '@/utils/icons';

function tabIcon(name: MciName) {
  return ({ color, size }: { color: string; size: number }) => (
    <MaterialCommunityIcons name={name} color={color} size={size} />
  );
}

export default function TabsLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { completed } = useOnboarding();

  if (completed === null) {
    return null;
  }
  if (!completed) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtleText,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: withAlpha(colors.copper, 0.3),
          borderTopWidth: 1,
          height: 62 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontFamily: fontFamily.medium,
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: t('tabs.map'), tabBarIcon: tabIcon('map-outline') }}
      />
      <Tabs.Screen
        name="explore"
        options={{ title: t('tabs.explore'), tabBarIcon: tabIcon('compass-outline') }}
      />
      <Tabs.Screen
        name="routes"
        options={{ title: t('tabs.routes'), tabBarIcon: tabIcon('map-marker-path') }}
      />
      <Tabs.Screen
        name="checklist"
        options={{ title: t('tabs.checklist'), tabBarIcon: tabIcon('check-circle-outline') }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: t('tabs.settings'), tabBarIcon: tabIcon('cog-outline') }}
      />
    </Tabs>
  );
}
