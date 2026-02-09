import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, CommonActions } from "@react-navigation/native";

export default function useLogout() {
    const navigation = useNavigation();
    
    const logout = async () => {
        //console.log('uselout: logout attempted'); // intento de cierre de sesion
        try {
            await AsyncStorage.multiRemove(["token", "nombre_usuario", "email"]);
            //console.log('uselout: token removed successfully'); // token eliminado con exito
            
            // Si estamos dentro de una pantalla del Drawer, necesitamos getParent() para ir al Stack.
            // Pero si estamos en el contenedor MyDrawer, navigation ya es el Stack.
            // Esta linea busca el padre, y si no hay (es null), usa el navigation actual.
            const targetNavigation = navigation.getParent() || navigation;

            targetNavigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                })
            );
        } catch (error) {
            console.error("error al salir:", error); // error al cerrar sesion
        }
    };
    return logout;
}