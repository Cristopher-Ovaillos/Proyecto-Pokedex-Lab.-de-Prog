import { useState } from "react";
import api from '../api/apiclient';
import { ENDPOINTS } from "../config";

export default function useRegister() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const register = async (nombre_usuario, email, contrasenia) => {
        setError(null);
        setLoading(true);
        console.log('useregister: attempting registration for user:', nombre_usuario, 'email:', email); // log de intento de registro

        try {
            console.log(ENDPOINTS.AUTH.REGISTER);
            const data = await api.post(ENDPOINTS.AUTH.REGISTER, { nombre_usuario, email, contrasenia });
            console.log('useregister: registration successful, received data:', data); // log de registro exitoso
            return data;
        } catch (err) {
            // err viene de apiclient: { status, data } — no es axios, no tiene .response
            const msg = err.data?.message || "error al registrar el usuario.";
            setError(msg);
            console.log('useregister: registration failed with error:', msg, '| status:', err.status); // log de error de registro
            throw err; 
        } finally {
            setLoading(false); // corregido: de flase a false
        }
    };
    return { register, loading, error };
}