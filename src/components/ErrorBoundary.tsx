import { Component, type ReactNode } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Üst düzey hata sınırı: herhangi bir ekran render sırasında hata fırlatırsa
 * uygulamanın beyaz ekrana düşmesini önler ve kurtarılabilir bir arayüz gösterir.
 * i18n'e bağımlı değildir (sağlayıcıların üstünde de çalışabilsin diye).
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown): void {
    // Geliştirmede konsola yaz; üretimde Google Play vitals yakalar.
    console.warn('Nisibis UI error:', error);
  }

  private reset = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <MaterialCommunityIcons name="compass-off-outline" size={40} color={colors.primary} />
          <Text style={styles.title}>Bir şeyler ters gitti</Text>
          <Text style={styles.message}>
            Beklenmeyen bir hata oluştu. Tekrar deneyebilirsin.
          </Text>
          <Pressable
            onPress={this.reset}
            accessibilityRole="button"
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonText}>Tekrar dene</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: colors.mutedText,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    ...typography.button,
    color: colors.onPrimary,
  },
});
