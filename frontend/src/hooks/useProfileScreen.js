import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUpdateUser from "./useUpdateUser";
import apiclient from "../api/apiclient";
import { ENDPOINTS } from "../config";

// pa manejar los datos del perfil screen que se van actualizando
export default function useProfileScreen() {
  const [nombre_usuario, setNombre_usuario] = useState("");
  const [email, setEmail] = useState("");
  const { modificarUser, loading, error, clearError } = useUpdateUser();

  // cargar datos al entrar
  useEffect(() => {
    const loadUser = async () => {
      try {
        // 1. Cargar cache local rapido
        const nombre = await AsyncStorage.getItem("nombre_usuario");
        const emailGuardado = await AsyncStorage.getItem("email");

        if (nombre) setNombre_usuario(nombre);
        if (emailGuardado) setEmail(emailGuardado);

        // 2. Sincronizar con API para datos frescos
        const response = await api.get(ENDPOINTS.AUTH.PROTECTED);
        if (response.data) {
          const { nombre_usuario: serverName, email: serverEmail } = response.data;

          setNombre_usuario(serverName);
          setEmail(serverEmail);

          await AsyncStorage.setItem("nombre_usuario", serverName);
          await AsyncStorage.setItem("email", serverEmail);
        }
      } catch (e) {
        console.log("Error sincronizando perfil:", e);
        if (e.status === 403 || e.status === 401) {
          // Token expirado. Lo ideal sería cerrar sesión automáticamente o avisar.
          // Por ahora, no hacemos nada para no romper el flujo visual, 
          // pero el usuario verá datos locales.
        }
        // Fallback silencioso, quedamos con datos locales si existen
      }
    };

    loadUser();
  }, []);

  // handler unificado post-update
  const actualizarDato = async (tipo, valor) => {
    await modificarUser(tipo, valor);

    switch (tipo) {
      case "username":
        setNombre_usuario(valor);
        await AsyncStorage.setItem("nombre_usuario", valor);
        break;

      case "email":
        setEmail(valor);
        await AsyncStorage.setItem("email", valor);
        break;

      case "password":
        // completar
        break;
    }
  };

  return {
    nombre_usuario,
    email,
    actualizarDato,
    loading,
    error,
    clearError
  };
}