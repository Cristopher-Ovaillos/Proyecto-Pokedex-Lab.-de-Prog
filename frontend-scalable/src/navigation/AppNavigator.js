import { useState, useEffect } from 'react'
//
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage'
// pantallas
import { InicioScreen } from '../features/home/screens/InicioScreen';
import { PokedexScreen } from '../features/home/screens/PokedexScreen';
import { MovimientosScreen } from '../features/home/screens/MovimientosScreen';
import { PerfilScreen } from '../features/home/screens/PerfilScreen';
import { CrearEquipoScreen } from '../features/home/screens/CrearEquipoScreen';
//auth
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { RegisterScreen } from '../features/auth/screens/RegisterScreen';
//styles
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
//bitacora3
import useLogout from "../hooks/useLogout";//bitacora-3
import styles from '../constants/styles';
import { Button, View, ActivityIndicator } from 'react-native' // Agregué View y ActivityIndicator para la carga


// se define ruta name="X". EL comopontente={y} recibira el navigation popr defecto

/* navigation.replace('home'), esta indicando que reemplace la ruta actual por la ruta llamada "x". 
Este string debe coincidir exactamente con el name que se haya escrito

*/
function MyDrawer() {
  const logout = useLogout();//bitacora-3
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerStyle: { width: 200 },
        //bitacora-3
        headerRight: () => <Button onPress={logout} title='Salir' className={styles.home.button}/> 
      }}
    >
      <Drawer.Screen name="Inicio" component={InicioScreen} />
      <Drawer.Screen name="Pokedex" component={PokedexScreen} />
      <Drawer.Screen name="Movimientos" component={MovimientosScreen} />
      <Drawer.Screen name="Perfil" component={PerfilScreen} />
      <Drawer.Screen name="Crear Equipo" component={CrearEquipoScreen} />
    </Drawer.Navigator>
 
  );
}

// decide si va a Login o a la App con Sidebar
export const AppNavigator = () => {

const [isLoading, setIsLoading] = useState(true);
const [initialRoute, setInitialRoute] = useState('Login'); // Usamos esto en lugar de isLogged

useEffect(() => {
  AsyncStorage.getItem('token').then(t => {
    // Si hay token, la ruta inicial es MainDrawer, si no Login
    setInitialRoute(t ? 'MainDrawer' : 'Login');
    setIsLoading(false);
  });
}, []);

if (isLoading) {
    return (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size="large" />
        </View>
    );
}; // pantalla de carga


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="MainDrawer" component={MyDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};