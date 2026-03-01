import { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import useLogin from '../../../hooks/useLogin';
import styles from '../../../constants/styles';
import { toast } from "sonner-native"; 


//exporto una funcion 
export function LoginScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const { login, loading, error } = useLogin();

  //funcion accionado por el boton
  const submit = () => {
    login(nombre, contrasenia)
      .then(() => {
        // CORRECCION: Quitamos el '?.' y usamos replace directo o reset.
        // Replace es más limpio aquí para ir al Drawer.
        navigation.replace('MainDrawer');
        //toast.success("Inicio de sesión exitoso");
      })
      .catch((e) => { 
        toast.error("Error al iniciar sesión");
         })
  };
  /*
    crear:
      contenener[
      texto iniciar sesion
      input nombre
      input nombre
      -utilziar un boton personalizable, se llama touchableopacity 
          en este boton, mostrar ENtrar o Cargando en funcion de un estado. entonces usamos codigo {}
      
      ]
  
  */
  return (
    <View className={styles.layout.centerAll}>

      <Text className={styles.ui.titleMain}>Iniciar sesion</Text>

      <TextInput className={styles.ui.input} placeholder="nombre de usuario" value={nombre} onChangeText={setNombre} autoCapitalize="none" keyboardType="email-address" />
      <TextInput className={styles.ui.input} placeholder="contrasenia" value={contrasenia} onChangeText={setContrasenia} secureTextEntry />

      <TouchableOpacity className={styles.ui.btnPrimary} onPress={submit} disabled={loading}>
        <Text className={styles.ui.btnText}>{loading ? '...' : 'Entrar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 20 }}>
        <Text className={styles.ui.label}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>

  );

}