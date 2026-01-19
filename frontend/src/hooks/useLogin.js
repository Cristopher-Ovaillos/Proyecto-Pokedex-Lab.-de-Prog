import { useState } from 'react';
import api from '../api/apiclient';
import { ENDPOINTS } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useLogin() {
    const [loading, setLoading] = useState(false);//por default no cargo 'false'
    const [error, setError] = useState(null);

    const login = async (nombre_usuario, contrasenia) => {
        setLoading(false);
        setError(null);

        try {
            //
            const data = await api.post(ENDPOINTS.AUTH.LOGIN, { nombre_usuario, contrasenia });
            //guardo el token con la etiqueja token
            // en Bruno el login me devuelve esto por ejemplo:

            /*
            objeto data
            {
                "success": true,
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c3VhcmlvIjoxLCJub21icmVfdXN1YXJpbyI6InVzdWFyaW8iLCJpYXQiOjE3Njc0NDQ1NzUsImV4cCI6MTc2NzQ0ODE3NX0.hyRPZQRrtJaDvrjBqIHuENBt2H0o6yE-9hglXMcDzNU",
                "message": "Login exitoso",
                    "data": {
                    "id_usuario": 1,
                    "nombre_usuario": "usuario",
                    "email": "usuarion@test.com"
                    }
            }
            */
            // console.log('useLogin data:', data);
            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('nombre_usuario', data.data.nombre_usuario);
            await AsyncStorage.setItem('email', data.data.email);
            // await AsyncStorage.setItem('contrasenia', contrasenia);   /* no se si va este */

            return data;

        } catch (err) {
            setError('[useLogin] error al iniciar sesion');
            throw err;
        } finally {
            setLoading(false);
        }

    }
    return {login, loading, error};
}

