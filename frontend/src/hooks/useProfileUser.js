import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUpdateUser from "./useUpdateUser";

// pa manejar los datos del perfil screen que se van actualizando
export default function useProfileScreen() {
  const [nombre_usuario, setNombre_usuario] = useState("");
  const [email, setEmail] = useState("");
  const { modificarUser, loading, error, clearError } = useUpdateUser();

  // cargar datos al entrar
  useEffect(() => {
    const loadUser = async () => {
      const nombre = await AsyncStorage.getItem("nombre_usuario");
      const emailGuardado = await AsyncStorage.getItem("email");

      if (nombre) setNombre_usuario(nombre);
      if (emailGuardado) setEmail(emailGuardado);
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