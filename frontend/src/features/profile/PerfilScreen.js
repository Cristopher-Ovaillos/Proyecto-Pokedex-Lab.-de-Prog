import { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
const styles = require("../../constants/styles");
import useLogin from "../../hooks/useLogin";
import { SafeAreaProvider } from "react-native-safe-area-context";

export const PerfilScreen = () => {
  const { login, loading, error } = useLogin();

  const [nombre_usuario, setNombre_usuario] = useState('user1');
  const [email, setEmail] = useState('user1@gmail.com');
  const [contrasenia, setContrasenia] = useState('user1234');
  const foto = "https://pngimg.com/uploads/pokemon/pokemon_PNG152.png";

  return (
    <SafeAreaProvider>
      <View className={styles.perfil.container}>
        <View className={styles.perfil.containerOpciones}>
          <View className={styles.perfil.iconPerfil1}>
            <View className={styles.perfil.fotoContainer}>
              <Image source={{ uri: foto }} className={styles.perfil.foto} />
              <TouchableOpacity onPress={() => alert("Cambiar icono")}>
                <Image
                  source={require("../../../assets/editIcon.png")}
                  className={styles.perfil.editIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className={styles.perfil.opciones}>
            <TextInput className={styles.register.input} placeholder="Nombre de usuario" value={nombre_usuario} onChangeText={setNombre_usuario} autoCapitalize="none" />
            <TextInput className={styles.register.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            <TextInput className={styles.register.input} placeholder="contrasenia" value={contrasenia} onChangeText={setContrasenia} secureTextEntry />

        </View>
      </View>

     
    </SafeAreaProvider>
  );
};
