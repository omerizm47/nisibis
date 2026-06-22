import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  type ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '@/theme';

interface RemoteImageProps {
  source: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  resizeMode?: 'cover' | 'contain';
}

/**
 * Uzak görseli yumuşak bir geçişle yükler; yükleme/başarısızlık durumunda
 * boş görünmemesi için taş tonlu bir degrade arka plan gösterir.
 */
export function RemoteImage({ source, style, imageStyle, resizeMode = 'cover' }: RemoteImageProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const [errored, setErrored] = useState(false);

  const reveal = () =>
    Animated.timing(opacity, {
      toValue: 1,
      duration: 350,
      // Web'de JS sürücüsü DOM'a yazılır; native sürücü web'de uygulanmaz.
      useNativeDriver: false,
    }).start();

  // Bundle'lanmış yerel görseller mount'tan önce hazır olabilir ve onLoad
  // tetiklenmeyebilir; mount'ta da görünür kıl ki kart asla boş kalmasın.
  useEffect(() => {
    const id = setTimeout(reveal, 60);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Kaynak değişince hata durumunu sıfırla (liste geri dönüşümünde takılı kalmasın).
  useEffect(() => {
    setErrored(false);
  }, [source]);

  return (
    <Animated.View style={[styles.container, style]}>
      <LinearGradient colors={gradients.nightStone} style={StyleSheet.absoluteFill} />
      {!errored && (
        <Animated.Image
          source={source}
          resizeMode={resizeMode}
          onLoad={reveal}
          onError={() => setErrored(true)}
          style={[styles.image, { opacity }, imageStyle]}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: colors.backgroundElevated,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});
