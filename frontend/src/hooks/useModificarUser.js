import { useState } from "react";
import api from "../api/apiclient";
import { ENDPOINTS } from "../config";

// pa manejar los updates de usuario
export default function useModificarUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = () => setError(null); // 👈 NUEVO

  const modificarUser = async (tipo, valor) => {
    setLoading(true);
    setError(null);

    // console.log("Modificando usuario:", tipo, valor);
    try {
      let endpoint = "";
      let body = {};

      switch (tipo) {
        case "username":
          endpoint = ENDPOINTS.USUARIOS.UPDATE_USERNAME;
          body = { nombre_usuario: valor };
          break;

        case "email":
          endpoint = ENDPOINTS.USUARIOS.UPDATE_EMAIL;
          body = { email: valor };
          break;

        case "password":
          //falta completarla
          endpoint = ENDPOINTS.USUARIOS.UPDATE_PASSWORD;
          body = {
            contraseniaNueva: valor,
          };
          break;

        default:
          throw new Error("Tipo de modificación no soportado");
      }

 
      const response = await api.put(endpoint, body);
      return response.data;

    } catch (err) {
      const msg = err.data.message;

      if (!msg){
        msg = "Error al modificar los datos del usuario";
      }
      setError(msg);
      throw err;

    } finally {
      setLoading(false);
    }
  };

  return { modificarUser, loading, error, clearError };
}