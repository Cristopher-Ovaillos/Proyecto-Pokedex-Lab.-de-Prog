import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, CommonActions } from "@react-navigation/native";

export default function useLogout() {
    const navigation = useNavigation();
    
    const logout = async () => {
        try {
            await AsyncStorage.removeItem("token");
            
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
            console.error("Error al salir:", error);
        }
    };
    return logout;
}