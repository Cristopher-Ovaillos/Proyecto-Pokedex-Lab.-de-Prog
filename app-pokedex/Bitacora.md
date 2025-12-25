

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



---

VISUALIZACION:

- https://docs.expo.dev/develop/user-interface/fonts/ 

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