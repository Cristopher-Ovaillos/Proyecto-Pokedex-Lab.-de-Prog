import "./global.css"
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from "expo-font";
// estilos centralizados, si son export van entre {}, usar classname porque usamos nativewind

//indice.js
import Index from './src/index'


export default function App() {
  const [fontsLoaded] = useFonts({
    'prstartk': require('./assets/fonts/prstartk.ttf')
  });



  if (!fontsLoaded) {
    return null; rrr
  }

  // 2. RETORNO PRINCIPAL: Esto es lo que se verá cuando la fuente esté lista
  return (
    <SafeAreaView style={{ flex: 1}}>
      <Index/>
    </SafeAreaView>
  );

}

//codigo de ejemplo para ver que si anda el safe area
/*

export default function App() {
  const [fontsLoaded] = useFonts({
    'prstartk': require('./assets/fonts/prstartk.ttf')
  });

    // en react native es style=objecto, objeto es {}

  if (!fontsLoaded) {
    return null; 
  }

  // 2. RETORNO PRINCIPAL: Esto es lo que se verá cuando la fuente esté lista
  return (
    <SafeAreaView style={{ flex: 1}}>
      <Text style={{ fontFamily: 'prstartk', fontSize: 20 }}>
        ¡Fuente cargada correctamente!
      </Text>
    </SafeAreaView>
  );

}

*/