import { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import useLogin from '../../../hooks/useLogin';
import styles from '../../../constants/styles';


//exporto una funcion 
export function LoginScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const { login, loading, error } = useLogin();

  //funcion accionado por el boton
  const submit = () => {
    login(nombre, contrasenia)
      .then(() => {
        // CORRECCIÓN: Quitamos el '?.' y usamos replace directo o reset.
        // Replace es más limpio aquí para ir al Drawer.
        navigation.replace('MainDrawer');
      })
      .catch((e) => { console.log(e) })
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
    <View className={styles.login.container}>
      <Text className={styles.login.title}>Iniciar sesion</Text>
      <TextInput className={styles.login.input} placeholder="nombre de usuario" value={nombre} onChangeText={setNombre} autoCapitalize="none" keyboardType="email-address" />
      <TextInput className={styles.login.input} placeholder="contrasenia" value={contrasenia} onChangeText={setContrasenia} secureTextEntry />

      {error && <Text className={styles.login.errorText}>{error}</Text>}

      <TouchableOpacity className={styles.login.button} onPress={submit} disabled={loading}>
        <Text className={styles.login.buttonText}>{loading ? '...' : 'Entrar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 20 }}>
        <Text className={styles.login.input}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>

  );

}