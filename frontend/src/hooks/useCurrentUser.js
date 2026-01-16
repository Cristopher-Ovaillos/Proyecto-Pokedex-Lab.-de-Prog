import { useState, useEffect } from 'react';
import AsynStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import 'core-js/stable/atob'; //ascii a binario, decodifica 64
// https://www.npmjs.com/package/jwt-decode

/* 
import 'core-js/stable/atob'; es necesario porque React Native necesita (el atob) para poder leer 
lo que dice el token, aunque no tenga el sello para fabricarlas. 
*/

export const useCurrentUser = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserFromToken = async () => {
            try {
                const token = await AsynStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    setUser({
                        id_usuario: decodedToken.id_usuario,
                        nombre_usuario: decodedToken.nombre_usuario,
                    });
                }

            } catch (error) {
                console.error("Error al decodificar el token: ", error);
                setUser(null)
            } finally {
                setLoading(false);
            }
        }
        //ejecuto
        fetchUserFromToken();

    }, []); //solo se renderiza la primera vez
    return { user, loading };
};