import { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

const styles = require("../../constants/styles");


export default function EditUserModal({
  visible,
  tipo,
  valorActual,
  onConfirm,
  onClose,
  loading,
  error
}) {
  const [valor, setValor] = useState("");



  useEffect(() => {
    if (visible) {
      setValor(valorActual || "");
    }
  }, [visible, valorActual]);

  const getTitle = () => {
    switch (tipo) {
      case "username":
        return "Editar nombre de usuario";
      case "email":
        return "Editar email";
      case "password":
        return "Editar contraseña";
      default:
        return "";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose} 
    >
      <View className={styles.modalInput.overlay}>
        <View className={styles.modalInput.container}>
          <Text className={styles.modalInput.title}>{getTitle()}</Text>

          <TextInput
            value={valor}
            onChangeText={setValor}
            secureTextEntry={tipo === "password"}
            autoCapitalize="none"
            className={styles.modalInput.input}
          />

      
          {error && (
            <Text className={styles.modalInput.error}>
              {error}
            </Text>
          )}

          <View className={styles.modalInput.actions}>
            <TouchableOpacity onPress={onClose}>
              <Text className={styles.modalInput.cancel}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={loading}
              onPress={() => onConfirm(valor)}
            >
              <Text className={styles.modalInput.confirm}>
                {loading ? "Guardando..." : "Aceptar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

