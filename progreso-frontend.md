
# Paso 1: preparar el entorno

Herramientas:
- react native expo : https://docs.expo.dev/
- tailwind para react native: https://www.nativewind.dev/ 
- fetch: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
Mas: 
- https://reactnative.dev/docs/environment-setup
- https://docs.expo.dev/get-started/set-up-your-environment/ 

1. npx create-expo-app@latest frontend --template blank
    - cd frontend
2. npm install nativewind
3. npm install tailwindcss@3.3.2 --save-dev //desactualizado pero meh
4. npx tailwindcss init // crea un tailwind.config.js

Lo que se intenta, es centralizar colores, fuentes.

# paso 2: Centralizar 

Si se requiere cambiar el estilo, solo editar tailwind.config.js. 
Seguiremos una semantica para definir los token (colores).

Visualizar:
```
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        23/12/2025     15:45                assets
d-----        23/12/2025     15:54                node_modules
-a----        26/10/1985     05:15            440 .gitignore
-a----        26/10/1985     05:15            454 App.js
-a----        23/12/2025     15:45            642 app.json
-a----        26/10/1985     05:15            307 index.js
-a----        23/12/2025     15:54         364343 package-lock.json
-a----        23/12/2025     15:54            453 package.json
-a----        23/12/2025     15:55            128 tailwind.config.js
```

configurar tailwind.config.js //ver archivo de ejemplo.

Codigo antes:
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

> `Objetivo: Alta cohesion`

## Paso 2.1

Nuestro objetivo es lograr mantenibilidad, y sobre todo un bajo acoplamiento (es decir que dependa de todo) vamos utilizar esta arquitectura de carpetas: 

```
src/
 ├── api/            # Layer de Infraestructura (Adapters)
 ├── components/     # UI Atómica (Botones, Cards)
 ├── hooks/          # Lógica de estado y efectos
 ├── screens/        # Vistas de alto nivel
 ├── theme/          # Configuraciones globales de estilo
 └── context/        # Gestión de Estado Global (Auth, Theme)
```

# Paso 3: API adapter

utilizaremos fetch nativo.
Si usamos directamente fetch en nuestro componentes, el codigo de la UI sbara demasiado sobre la RED. Ademas, si la url cambia o necesitamos agregar algun token sea eso de JWT, esto ayudara a evitar editar muchos archivos. Simplemente desde aca se hace todo.
-Patron adapter es esto (centralizalos la comunicacion)

apiConfig.js //god

# paso 4: configurar el entorno para que reconozca nativewind y ademas config babel.js

Para que soo entren usuarios registrados necesitamos implementar un route patter. Usamos EXPO ROUTER y Context API.
https://docs.expo.dev/router/installation/ 

native wind necesita un plugin en babel para transformar las clases de tailwind en objetos de estilo que el motor de android entienda
(android no entiende className)

- crear frontend/babel.config.js


#paso 4: auth context

solo entrar usuarios registrados, entonces debemos guardar si hay un usario guardado o no. Para que no se pierda, se hace un CONTEXTO API que lo mantiene vivo en toda la app.

- crear src/context/ AuthContext.js

# paso 5: navegacion expo router

para lograr el bajo acoplamiento, usaremos rutas basadas en archivos. entonces vamos a dividir la app en dos grupos: auth y app.

```
app/
 ├── (auth)/           # Rutas públicas
 │    └── login.js
 ├── (app)/            # Rutas privadas
 │    ├── _layout.js   # Aquí validamos el acceso
 │    └── index.js     # Home de la Pokedex
 └── _layout.js        # Root: Envuelve todo con AuthProvider
```



