# Configurar:

npx create-expo-app@latest  frontend --template blank


https://www.nativewind.dev/docs/getting-started/installation

Realizar acciones de documentacion.


Error DE NPM RUN START, debido a babel "Error: Cannot find module 'babel-preset-expo'" :

- solucion: https://docs.expo.dev/versions/latest/config/babel/ 

listo anda joya.


*cheat-seet de tailwind: https://nerdcave.com/tailwind-cheat-sheet*

---

### Configuración de Fuentes

Para usar fuentes personalizadas en **NativeWind v4**, el identificador debe coincidir en tres archivos:

**Carga de la fuente (`App.js`)**
Se define un nombre clave para el archivo `.ttf`:

```javascript
const [fontsLoaded] = useFonts({ 
  'mi-fuente': require('./assets/fonts/nombre-archivo.ttf'), 
});

```

**2. Registro en tailwind.config.js**
Se vincula ese mismo nombre para habilitar la clase `font-mi-fuente`:

```javascript
theme: {
  extend: {
    fontFamily: {
      'mi-fuente': ["mi-fuente"], 
    },
  },
},

```

**Configuración de babel.config.js**
Es obligatorio habilitar `jsxImportSource` para que NativeWind procese las fuentes correctamente:

```javascript
return {
  presets: [
    ["babel-preset-expo", { jsxImportSource: "nativewind" }],
    "nativewind/babel",
  ],
};

```


**Nota:** Si la fuente no se aplica en el componente, limpiar la caché con `npx expo start -c`.

- Se aplica mediante la clase font- seguida del nombre configurado.


---

En App.js

Para posicionar correcatemente el contenido, y no colapsar con el navbar del mobile utilizaremos la siguiente documentacion.
https://docs.expo.dev/develop/user-interface/safe-areas/

- install: npx expo install react-native-safe-area-context


seguido, imporatremos en app.js lo especificado.

Los import se heredan? duda que tuve, pero no se hereda, lo que si se hereda es safearea.

---

estilos y colores centralizados en:
- src/constants/colors.js
- src/constants/styles.js

Seguimos este formato, porque no utilizaremos cosas complicadas, y se noas hace mas facil usar esto en este tipo de aplicacion.

como funciona?

en tailwind.config.js  dentro de extends:{}
agregamos:

```
      fontFamily: {
        prstartk: ["prstartk"],
      }, 
      colors: {
        // usamos lo definido en src/constants
        pokedex: colores
      },
```

ya no debmos preocuparnos por importar los colores para utilizarlos.

los colores definidos useguimos la siguiente forma.

el flujo es:

[Prefijo] + [tailwind-config: en este caso es pokedex]+ modo + color.

- modo+color es respecto al archivo colors.js
    
    El Prefijo (La Acción):
    Tailwind ya los tiene definidos. El más común es bg- (para fondos), pero también existen text- (para texto) o border- (para bordes).
    Tu Identidad (El Color):
    Es el nombre que tú inventas en tu configuración. Si tu color se llama mi-color-azul, la clase será bg-mi-color-azul.

---

listo con lo anterior ya plateamos el skeleton.

menu

npx expo install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context