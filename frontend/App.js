import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './global.css';
import { Toaster } from 'sonner-native';
//import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useEffect } from 'react';
//import { View, Text } from 'react-native';
//import styles from './src/constants/styles';
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'pixel': require('./src/assets/fonts/prstartk.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppNavigator />
        <Toaster />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );

}

/*

    <SafeAreaProvider>

      <SafeAreaView className={styles.container}>
        <AppNavigator />//
      </SafeAreaView>

    </SafeAreaProvider>


        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'pixel' }}>Interasddas Black</Text>
        </View>

----
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </SafeAreaProvider>
  );
*/
