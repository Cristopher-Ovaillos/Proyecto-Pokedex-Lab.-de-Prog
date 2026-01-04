import { useState } from "react";
import api from '../api/apiclient';
import { ENDPOINTS } from "../config";

export default function useRegister() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const register = async (nombre_usuario, email, contrasenia) => {
        setError(null);
        setLoading(true);

        try {
            console.log(ENDPOINTS.AUTH.REGISTER);
            const data = await api.post(ENDPOINTS.AUTH.REGISTER, { nombre_usuario, email, contrasenia });
            return data;
        } catch (err) {
            // guardamos el mensaje para el estado local pero lanzamos el error para el componente
            const msg = err.response?.data?.message || "error al registrar el usuario.";
            setError(msg);
            throw err; 
        } finally {
            setLoading(false); // corregido: de flase a false
        }
    };
    return { register, loading, error };
}