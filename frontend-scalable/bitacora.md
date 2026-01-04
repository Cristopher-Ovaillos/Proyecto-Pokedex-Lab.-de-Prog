
drawer-based- navigator:
https://docs.expo.dev/router/advanced/tabs/
https://reactnavigation.org/
## Bitácora de Cambios - Pantallas, Estilos y Navegación

### 1. Definir el sistema de diseño y colores
- Edita `src/constants/theme.js` para definir todos los colores base que usarás en la app (primary, secondary, background, text, error, success, warning, info, dark, light).

### 2. Configurar Tailwind y NativeWind
- Instala dependencias:
  - `npm install nativewind tailwindcss`
- Configura `tailwind.config.js` para mapear los colores y fuentes definidos en theme.js a clases de utilidad.

### 3. Fuente personalizada
- Descarga la fuente pixel (prstartk.ttf) y colócala en `src/assets/fonts/`.
- En `App.js`, usa `useFonts` de expo-font para cargar la fuente.
- En `tailwind.config.js`, define la fuente como `font-pixel`.

### 4. Instalar y configurar navegación
- Instala dependencias:
  - `npx expo install react-native-gesture-handler react-native-reanimated react-native-worklets expo-font`
  - `npm install @react-navigation/native @react-navigation/drawer @react-navigation/native-stack`
- En `babel.config.js`, agrega:
  - `plugins: ['react-native-reanimated/plugin']` (al final del array)

### 5. Centralizar estilos por componente
- Crea o edita `src/constants/styles.js` para definir un objeto de estilos por cada pantalla/componente (ejemplo: styles.home, styles.login, styles.pokedex, etc.).
- Cada objeto debe tener al menos `container` y `title`, y puedes agregar más según lo que necesite cada pantalla.

### 6. Crear pantallas
- Crea los archivos de pantalla en sus carpetas correspondientes:
  - LoginScreen.js y RegisterScreen.js en `src/features/auth/screens/`
  - InicioScreen.js, PokedexScreen.js, MovimientosScreen.js, PerfilScreen.js, CrearEquipoScreen.js en `src/features/home/screens/`
- Cada pantalla debe importar su objeto de estilos desde styles.js y usarlo en sus componentes.

### 7. Configurar navegación
- Edita `src/navigation/AppNavigator.js` para:
  - Usar las nuevas pantallas en el Drawer (sidebar): Inicio, Pokedex, Movimientos, Perfil, Crear Equipo.
  - Mostrar Login y Register en el stack principal si el usuario no está logueado.

### 8. Buenas prácticas
- No uses clases tailwind sueltas en las pantallas, solo usa los estilos centralizados por componente desde styles.js.
- Así aseguras consistencia y fácil mantenimiento.


### 10. Cliente centralizado de API (apiclient.js)
- Crea `src/api/apiclient.js` para centralizar todas las peticiones HTTP de la app usando fetch (no axios).
- El archivo expone métodos api.get, api.post, api.put y api.delete, que manejan automáticamente JSON y errores.
- Así, cualquier pantalla o feature puede importar `api` y hacer peticiones como `api.get('/ruta')`, `api.post('/ruta', data)`, etc.
- Permite mantener la lógica de red en un solo lugar y facilita el manejo de autenticación o errores globales si se requiere.

**Ejemplo de uso:**
```js
import api from '../api/apiclient';
// Obtener datos
const data = await api.get('/pokemon');
// Enviar datos
const res = await api.post('/login', { usuario, password });
```

### 9. Documentación consultada
- https://docs.expo.dev/develop/user-interface/fonts/
- https://reactnavigation.org/
- https://docs.expo.dev/router/advanced/tabs/

---
---


LOGIN:
@theme.js @styles.js @useLogin.js @LoginScreen.js @index.js @apiclient.js 

En useLogin:
https://react-native-async-storage.github.io/2.0/Installation/
https://react-native-async-storage.github.io/2.0/Usage/ 
utilizaremos esto para guardar los token


  - npm install @react-native-async-storage/async-storage

Para el LoginScreen, con el fin de separar responsabilidades...vamos a crear un hook que se encargue de hacer las peticiones.

mas info en los archivos mencionados, estan comentados.

//en appnavigator:
El error se debe a una
inconsistencia en la sintaxis de exportación e importación.
En el archivo de navegación se intenta importar el componente mediante una importación nombrada (usando llaves { LoginScreen }), lo cual requiere que el componente haya sido exportado explícitamente con ese nombre. Sin embargo, en el archivo de origen se utiliza una exportación por defecto (export default).
Esta discrepancia provoca que el sistema reciba un valor undefined en lugar del componente esperado, generando el fallo en la navegación. Para corregirlo, se debe eliminar el uso de llaves en la sentencia de importación o ajustar la exportación para que coincida con el nombre solicitado.

crear funciones utilizables es const nombre = ()=>{...}

*APi client*

al api client ahora que agregamos usamos el uso de token con asynstorage.


en app navigator cada <Stack.Screen name="X" component={Y}/> define la ruta "X". El componente Y recibirá navigation.


parte 3:

logout

1. useLogout
2. integrar logout al drawer.

En login generamos un token (el que recibimos de la api por /auth/login), en este paso deberemos eliminar el token generado y para lograr esto debemos buscar en el storage por su etiqueta "token". Para integrar este hook, haremos uso de un boton que acciona una funcion luego de presionarlo.