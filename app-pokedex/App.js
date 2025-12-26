import { useCallback } from 'react';
import { View, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';

// Evita que la pantalla de carga se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function App() {
  // 1. Cargamos la fuente en memoria
  const [fontsLoaded, fontError] = useFonts({
    'RetroPixel': PressStart2P_400Regular,
  });

  // 2. Función para ocultar el Splash Screen cuando todo esté listo
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <View onLayout={onLayoutRootView} className="flex-1 bg-black items-center justify-center">
      <Text className="text-white font-['RetroPixel'] text-lg">
        POKEDEX 2025
      </Text>
    </View>
  );
}