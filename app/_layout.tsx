import 'react-native-gesture-handler';

import { useEffect, useState } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fraunces_600SemiBold, Fraunces_700Bold } from '@expo-google-fonts/fraunces';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { I18nextProvider } from 'react-i18next';

import i18n, { loadStoredLanguage } from '@/i18n';
import { ProgressProvider } from '@/hooks';
import { CelebrationProvider, ErrorBoundary } from '@/components';
import { OnboardingProvider } from '@/hooks/useOnboarding';
import { colors } from '@/theme';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    ...MaterialCommunityIcons.font,
  });
  const [i18nReady, setI18nReady] = useState(false);
  const { width: windowWidth } = useWindowDimensions();
  const frameWidth = Platform.OS === 'web' ? Math.min(windowWidth, 440) : undefined;

  useEffect(() => {
    void loadStoredLanguage().finally(() => setI18nReady(true));
  }, []);

  useEffect(() => {
    if (fontsLoaded && i18nReady) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, i18nReady]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }
    document.documentElement.style.backgroundColor = colors.background;
    document.body.style.backgroundColor = colors.background;
    const applyLang = () => {
      const lang = (i18n.language || 'tr').split('-')[0];
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    };
    applyLang();
    i18n.on('languageChanged', applyLang);
    return () => {
      i18n.off('languageChanged', applyLang);
    };
  }, []);

  if (!fontsLoaded || !i18nReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ErrorBoundary>
        <I18nextProvider i18n={i18n}>
          <OnboardingProvider>
            <ProgressProvider>
              <CelebrationProvider>
                <StatusBar style="dark" />
              <View style={[styles.frame, frameWidth != null ? { width: frameWidth } : null]}>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: colors.background },
                    animation: 'slide_from_right',
                  }}
                >
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
                  <Stack.Screen name="place/[id]" />
                  <Stack.Screen name="route/[id]" />
                  <Stack.Screen name="story" />
                  <Stack.Screen name="privacy" options={{ presentation: 'modal' }} />
                </Stack>
              </View>
              </CelebrationProvider>
            </ProgressProvider>
          </OnboardingProvider>
        </I18nextProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: Platform.OS === 'web' ? 'center' : 'stretch',
  },
  frame: {
    flex: 1,
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderLeftWidth: Platform.OS === 'web' ? StyleSheet.hairlineWidth : 0,
    borderRightWidth: Platform.OS === 'web' ? StyleSheet.hairlineWidth : 0,
  },
});
