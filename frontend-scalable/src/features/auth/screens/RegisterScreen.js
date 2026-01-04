import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import useRegister from "../../../hooks/useRegister";
import styles from "../../../constants/styles";

export function RegisterScreen({ navigation }) {
  const [nombre_usuario, setNombre_usuario] = useState('');
  const [email, setEmail] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const { register, loading, error } = useRegister();//hook

  //accion
  const submit = () => {
    if (!nombre_usuario || !email || !contrasenia) {
      Alert.alert('Campos incompletos', 'RELLENA LOS DATOS LOCO');
      return;
    }

    register(nombre_usuario, email, contrasenia)
      .then((response) => {
        Alert.alert('Registro Exitoso', response.message || 'Ahora puedes iniciar sesión.');
        navigation.navigate('Login');
      })
      .catch((e) => {
        console.error("Error en el registro:", e.data);
        const server = e.data?.message || 'No se pudo completar el registro. Inténtalo de nuevo.';
        Alert.alert('Error de Registro', server);
      });

  };
  /* 
  contenedor
    text
      inputx3
      boton de registrarse

  */
  return (
    <View className={styles.register.container}>
      <Text className={styles.register.title}>Crear POKE-cuenta</Text>

      <TextInput className={styles.register.input} placeholder="Nombre de usuario" value={nombre_usuario} onChangeText={setNombre_usuario} autoCapitalize="none" />
      <TextInput className={styles.register.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput className={styles.register.input} placeholder="contrasenia" value={contrasenia} onChangeText={setContrasenia} secureTextEntry />

      <TouchableOpacity className={styles.register.button} onPress={submit} disabled={loading}>
        <Text className={styles.register.buttonText}> {loading ? '...' : 'Crear Cuenta'}</Text>
      </TouchableOpacity>

      {error && <Text className={styles.register.errorText}>{error}</Text>}
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 20 }}>
        <Text className={styles.register.input}>¿Ya tienes cuenta? Inicia Sesion</Text>
      </TouchableOpacity>

    </View>



  );


}