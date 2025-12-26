

Vamos a usar la documentacion oficial-



DOCUMENTACION:
- https://docs.expo.dev/router/installation/ 
- https://www.nativewind.dev/docs/getting-started/installation
- https://reactnative.dev/docs/components-and-apis
- https://docs.expo.dev/tutorial/create-your-first-app/ 
- https://docs.expo.dev/


Proyecto-objetivos:
- El objetivo de esta aplicacion es que sea escalable, para eso necesitaremos la siguiente arquitectura de carpetas.

**Esto cumple con caracteristicas deseables: Desacoplamiento, y modularizacion.**

```
/pokedex-app
  /src
    /api          <-- Capa de servicios (Adapter Pattern)
    /components   <-- Componentes reutilizables (Botones, Cards)
    /hooks        <-- Lógica de estado y llamadas a la API
    /theme        <-- Tokens de diseño (colores, tipografía)
    /utils        <-- Funciones puras de ayuda
  /app            <-- Rutas (Pantallas de la aplicación)
```

Expo Router es un estandar que se basa en archivos. 
Para los estilos, Native Wind. Este permite usar clases de tailwind, pero internamente las transforma en stylesheet de react native para que no haya perdida de rendimiento.

1. npx create-expo-app@latest app-pokedex --template blank

En react native, no hay css. Usamos NativeWind que lo que hace es traducir clases de tailwind a objetos  (StyleSheet) de react native.

link: https://www.nativewind.dev/docs/getting-started/installation

2. npx expo install nativewind tailwindcss react-native-reanimated react-native-safe-area-context  

Iniciamos tailwind: npx tailwindcss init
Crea un archivo tailwind.config.js. EDITAR

Archivo sin modificar:
```
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
---

Con el fin de tener todo ordenado vamos a usar un arq. de carpetas que siga uno de los objetivos esperados en un proyecto que es el "DESACOPLAMIENTO".
```
  /src
    /api          <-- Capa de servicios (Adapter Pattern)
    /components   <-- Componentes reutilizables (Botones, Cards)
    /hooks        <-- Lógica de estado y llamadas a la API
    /screen        <-- 
    /style        <-- Tokens de diseño (colores, tipografía)
    /utils        <-- Funciones puras de ayuda
  /app            <-- Rutas (Pantallas de la aplicación)
```

---

API ADAPTER:
- Crear em src/api/client.js

Vamos a evitar usar fetch directamente en los componentes. La razon proviene siempre en el cambio, si quiero añadir algo extra no quiero ir pantalla por pantalla agregando algun aspecto.

Caracteristicas que usamos de ahora en adelante (hay que entenderlo):
- ASYNC
- =>
- header http para auth,etc (ver link): https://developer.mozilla.org/es/docs/Web/HTTP/Reference/Headers 
- spread operator
- single source of truth.
- headerDefault: es lo que nos da el desacoplamiento. Si en esta version (v1) implementamos en el futuro JWT, añadimos el token (no se como funciona eso todavia). 
- await fetch: javascript pausa la ejecucion, RECORDAD QUE MONO HILO. Con await no bloqueados el hilo hasta que el SO reciba los paquetes de red.


** COMO ESTO ES LOCAL HOST, Y REQUERIMOS USAR EXPO GO, cambiar la URL de config.js por la IP que se consigue en la terminal con el comando: ipconfig (NO SUBIR ESTO A GITHUB XD).

LocalHost: Ejectuamos nuestro backend en nuestra computadora, y usamos expo go. El error es "NETWORK request failed".

Esto sucede porque localhost se refiere al propio dispositivo. Expo go no funciona en nuestro dispositivo que es la pc donde se ejecuta el backend.
Solucion: Busco mi IP local (de mi red) usando ipconfig. 

---

VISUALIZACION:

Tenemos pensado usar un estilo 8 bits, y el texto por defecto no va con el estilo. Es esta razon, que intentaremos utilizar la practica que se hace en pagina web de escritorio que es de @importar la fuente que esta almacenada en google fonts pero en REACT/expo.
busqueda: "how to use google fonts in expo".
- https://docs.expo.dev/develop/user-interface/fonts/  (ver ejemplo de codigo de los imports que hace, muy bien explicado esta-LEER)

command: 
- npm install expo
- npx expo install expo-font @expo-google-fonts/press-start-2p 
- Ver efecto en app.json.

* la pagina dice que instalar esto: npx expo install expo-font expo-splash-screen

Acontinuacion, ARCHIVO App.js el SO necesita cargar el archivo .ttf en la ram antes de que react native intente renderizar cualquier texto. 

```
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```
** CODIGO antes de modificacion.

Necesitamos renderizar cualquier texto, debemos hacer uso de CALLBACKs, view, useFonts.
- https://react.dev/reference/react/useCallback (hook que nos ayudara a almacenar una configuracion en cache- useCallback(fn, dependencies)).


---


---


---


---


---


---


---


---


---


---


---


---


---


---


---


---


---


---


---


---


---


---


---


---