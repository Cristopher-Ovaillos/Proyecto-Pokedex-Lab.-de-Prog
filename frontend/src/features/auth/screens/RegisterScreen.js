import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import useRegister from "../../../hooks/useRegister";
import styles from "../../../constants/styles";
//utilizaremos sonner para mostrar mensajes de error o exito, pero por ahora usaremos alert para simplificar
import { toast } from "sonner-native"; 

export function RegisterScreen({ navigation }) {
  const [nombre_usuario, setNombre_usuario] = useState('');
  const [email, setEmail] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const { register, loading, error } = useRegister();//hook

  //accion
  const submit = () => {
    if (!nombre_usuario || !email || !contrasenia) {
      toast.error('Por favor, completa todos los campos para registrarte.');
      return;
    }

    register(nombre_usuario, email, contrasenia)
      .then((response) => {
        toast.success(response.message || 'Registro exitoso. Ahora puedes iniciar sesión.');
        navigation.navigate('Login');
      })
      .catch((e) => {
        // e viene de apiclient: { status, data } — no es axios, no tiene .response
        console.error("Error en el registro:", e);
        const server = e.data?.message || 'No se pudo completar el registro. Inténtalo de nuevo.';
        toast.error(server);
      });

  };
  /* 
  contenedor
    text
      inputx3
      boton de registrarse

  */
  return (
    <View className={styles.layout.centerAll}>
      <Text className={styles.ui.titleMain}>Crear POKE-cuenta</Text>

      <TextInput className={styles.ui.input} placeholder="Nombre de usuario" value={nombre_usuario} onChangeText={setNombre_usuario} />
      <TextInput className={styles.ui.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput className={styles.ui.input} placeholder="contrasenia" value={contrasenia} onChangeText={setContrasenia} secureTextEntry />

      <TouchableOpacity className={styles.ui.btnPrimary} onPress={submit} disabled={loading}>
        <Text className={styles.ui.btnText}> {loading ? '...' : 'Crear Cuenta'}</Text>
      </TouchableOpacity>

      {error && <Text className={styles.ui.error}>{error}</Text>}
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 20 }}>
        <Text className={styles.ui.label}>¿Ya tienes cuenta? Inicia Sesion</Text>
      </TouchableOpacity>

    </View>



  );


}