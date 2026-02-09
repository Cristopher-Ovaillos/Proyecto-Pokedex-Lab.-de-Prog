import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,

} from "react-native";
import { toast } from "sonner-native";
import { FontAwesome5 } from "@expo/vector-icons";

import OptionPerfil from "./OptionPerfil";
import EditUserModal from "./EditUserModal";
import useLogout from "../../hooks/useLogout";
import useProfileScreen from "../../hooks/useProfileScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";

const styles = require("../../constants/styles");

export const PerfilScreen = () => {
  const logout = useLogout();

  const {
    nombre_usuario,
    email,
    actualizarDato,
    loading,
    error,
    clearError
  } = useProfileScreen();

  const [modalVisible, setModalVisible] = useState(false);
  const [campoEditar, setCampoEditar] = useState(null);

  const foto = "https://pngimg.com/uploads/pokemon/pokemon_PNG152.png";

  const abrirModal = (tipo) => {
    setCampoEditar(tipo);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    clearError();
    setModalVisible(false);
    setCampoEditar(null);
  };

  return (
    <SafeAreaProvider>
      <View className={styles.perfil.container}>
        <View className={styles.perfil.containerOpciones}>
          <View className={styles.perfil.iconPerfil1}>
            <View className={styles.perfil.fotoContainer}>
              <Image source={{ uri: foto }} className={styles.perfil.foto} />
              <TouchableOpacity onPress={() => toast.info("Próximamente", { description: "Funcionalidad en desarrollo" })} className="absolute bottom-0 right-0 bg-white rounded-full p-1" >
                <FontAwesome5 name="pen" size={14} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className={styles.perfil.opciones}>
          <Text className="font-bold text-3xl">{nombre_usuario}</Text>
          <Text>{email}</Text>

          <View className={styles.perfil.vistaOpciones}>
            <OptionPerfil
              value="Cambiar nombre"
              nameIcon="user"
              onEdit={() => abrirModal("username")}
            />

            <OptionPerfil
              value="Cambiar email"
              nameIcon="envelope"
              onEdit={() => abrirModal("email")}
            />

            <OptionPerfil
              value="Cambiar contraseña"
              nameIcon="shield"
              onEdit={() => abrirModal("password")}
            />

            <OptionPerfil
              value="Cerrar sesión"
              nameIcon="sign-out"
              onEdit={logout}
            />
          </View>
        </View>

        <EditUserModal
          visible={modalVisible}
          tipo={campoEditar}
          valorActual={
            campoEditar === "username"
              ? nombre_usuario
              : campoEditar === "email"
                ? email
                : ""
          }
          loading={loading}
          error={error}
          onClose={cerrarModal}
          onConfirm={async (valor) => {
            await actualizarDato(campoEditar, valor);
            cerrarModal();
          }}
        />
      </View>
    </SafeAreaProvider>
  );
};