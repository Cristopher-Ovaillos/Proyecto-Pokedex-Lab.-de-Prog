---

## ¿Cómo funciona internamente el authMiddleware?

1. **Recepción de la petición:**
   - Cuando una ruta tiene el middleware, Express ejecuta primero la función authMiddleware antes de llegar al controlador.

2. **Extracción del token:**
   - El middleware busca la cabecera `Authorization` y extrae el token JWT.
   - Si no hay token, responde con `{ success: false, error: 'Token requerido' }` y detiene el flujo.

3. **Verificación del token:**
   - Usa `jwt.verify()` para comprobar que el token es válido y no ha expirado.
   - Si el token es inválido o expiró, responde con `{ success: false, error: 'Token inválido' }` y detiene el flujo.

4. **Usuario autenticado:**
   - Si el token es válido, la información del usuario (por ejemplo, id, rol, email) queda disponible en `req.user`.
   - Llama a `next()` para que la petición continúe al siguiente middleware o controlador.

5. **El controlador puede usar `req.user`:**
   - Por ejemplo, para saber quién es el usuario autenticado o aplicar lógica según su rol.

---

## ¿Cómo gestionar permisos y roles?

Si tienes varios tipos de usuarios (por ejemplo, admin, user, guest), puedes guardar el rol en el JWT al generarlo:

```js
const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, 'tu_clave_secreta');
```

Luego, en el middleware o en el controlador, puedes verificar el rol:

```js
function requireRole(rolRequerido) {
  return function (req, res, next) {
    if (!req.user || req.user.rol !== rolRequerido) {
      return res.status(403).json({ success: false, error: 'Permiso denegado' });
    }
    next();
  };
}

// Uso en rutas:
router.get('/admin', authMiddleware, requireRole('admin'), adminController.dashboard);
```

Puedes adaptar `requireRole` para aceptar varios roles o permisos según tu necesidad.

---

**Resumen:**
- El authMiddleware protege rutas y deja la info del usuario autenticado en `req.user`.
- Puedes crear middlewares adicionales para verificar roles/permisos y así controlar el acceso a rutas según el tipo de usuario.
### ¿Dónde va el middleware?

Lo recomendable es crear el middleware de autenticación en un archivo aparte, por ejemplo:

`src/shared/authMiddleware.js`

Así puedes importarlo y reutilizarlo en cualquier ruta que quieras proteger.

---
### Sobre la cabecera Authorization

Por convención, el token JWT se envía en la cabecera `Authorization` con el formato:

```
Authorization: Bearer <token>
```

Esta cabecera es estándar para autenticación con tokens, pero si lo deseas puedes cambiar el nombre de la cabecera (por ejemplo, `x-access-token`). Sin embargo, lo más recomendable es usar `Authorization` para compatibilidad y claridad.

Si cambias el nombre de la cabecera, debes modificar tanto el frontend como el middleware para buscar el token en la nueva cabecera.

---
### Estructura de la respuesta del backend

Cuando el middleware detecta un error (token faltante o inválido), la respuesta del backend es un objeto JSON, por ejemplo:

```json
{
   "success": false,
   "error": "Token requerido"
}
```

o

```json
{
   "success": false,
   "error": "Token inválido"
}
```

El frontend puede leer este objeto y actuar en consecuencia (redirigir, mostrar mensaje, etc).
## ¿Cómo aplicarlo según la arquitectura del proyecto?

En este proyecto, cada capa tiene una responsabilidad clara:

### 1. Repository
- Solo se encarga de guardar y recuperar datos de la base de datos.
- No debe tener lógica de autenticación ni de seguridad.
- Ejemplo: guarda la contraseña ya hasheada, nunca en texto plano.

### 2. Service
- Aquí va la lógica de autenticación y seguridad.
- Al registrar: hashea la contraseña con bcrypt antes de pasarla al repository.
- Al hacer login: compara la contraseña ingresada con la hasheada usando bcrypt.
- Si el login es exitoso, genera el JWT y lo retorna al controller.

### 3. Controller
- Recibe la petición y llama al service.
- Solo se encarga de manejar la respuesta HTTP (éxito o error).
- No debe tener lógica de autenticación ni de acceso a la base de datos.

### 4. Routes
- Define los endpoints y delega al controller.
- Para rutas protegidas, puede usar un middleware que verifique el JWT antes de llegar al controller.

---

### Ejemplo de flujo para registro:
1. **Route** recibe POST `/register` → llama al **controller**.
2. **Controller** recibe los datos → llama al **service**.
3. **Service** valida y hashea la contraseña → llama al **repository** para guardar.
4. **Repository** guarda los datos en la base.
5. **Service** retorna el resultado al **controller**.
6. **Controller** responde al cliente.

### Ejemplo de flujo para login:
1. **Route** recibe POST `/login` → llama al **controller**.
2. **Controller** recibe los datos → llama al **service**.
3. **Service** busca el usuario, compara la contraseña con bcrypt.
4. Si es correcto, **service** genera el JWT y lo retorna.
5. **Controller** responde al cliente con el JWT.

---

De esta forma, cada capa cumple su función y la seguridad se maneja correctamente en el service.
# Autenticación y Protección de Archivos: Flujo Backend y Frontend

Este documento explica de forma simple cómo funciona la autenticación y protección de archivos entre el backend y el frontend usando bcrypt y JWT.

## 1. Registro de Usuario (Signup)

### Frontend
- El usuario ingresa su nombre, email y contraseña.
- El frontend envía estos datos al backend (por ejemplo, a `/api/usuarios/registro`).

### Backend
- Recibe los datos.
- Usa **bcrypt** para encriptar la contraseña antes de guardarla en la base de datos.
- Guarda el usuario con la contraseña encriptada.
- Responde con un mensaje de éxito o error.

## 2. Inicio de Sesión (Login)

### Frontend
- El usuario ingresa email y contraseña.
- El frontend envía estos datos al backend (por ejemplo, a `/api/usuarios/login`).

### Backend
- Busca el usuario por email.
- Usa **bcrypt** para comparar la contraseña ingresada con la guardada.
- Si es correcta, genera un **JWT** (token de autenticación).
- Devuelve el JWT al frontend.

## 3. Uso del JWT

### Frontend
- Guarda el JWT (en localStorage, sessionStorage o cookies seguras).
- Para acceder a rutas protegidas, envía el JWT en la cabecera `Authorization` (por ejemplo, `Bearer <token>`).

### Backend
- Recibe el JWT en la cabecera de cada petición protegida.
- Verifica el JWT (firma y validez).
- Si es válido, permite el acceso; si no, responde con error de autenticación.

## 4. Logout

### Frontend
- Elimina el JWT guardado (localStorage, sessionStorage o cookies).
- Redirige al usuario fuera de las rutas protegidas.

### Backend
- No necesita hacer nada especial (el JWT simplemente deja de enviarse).

---

## Resumen Visual del Flujo

1. **Registro:**
   - Frontend → Backend (datos) → Backend encripta y guarda
2. **Login:**
   - Frontend → Backend (datos) → Backend verifica y responde con JWT
3. **Acceso Protegido:**
   - Frontend envía JWT → Backend verifica JWT → Permite o niega acceso
4. **Logout:**
   - Frontend elimina JWT

---

## Notas
- **bcrypt**: Sirve para encriptar y comparar contraseñas de forma segura.
- **JWT**: Es un token que identifica al usuario y se usa para acceder a rutas protegidas.
- **Nunca** guardes contraseñas sin encriptar ni el JWT en lugares inseguros.

---

¡Listo! Así funciona la autenticación y protección de archivos de forma simple entre backend y frontend.

---

## ¿Cómo aplicarlo en este proyecto?

### 1. Instalación de dependencias

En la raíz del proyecto, instala los paquetes necesarios:

```bash
npm install bcrypt jsonwebtoken
```


### 2. Registro y Login en el Backend

- El controller solo recibe la petición y llama al service.
- El service usa `bcrypt` para encriptar la contraseña al registrar un usuario (por ejemplo, en `usuarioService.js`).
- El service usa `bcrypt.compare` para verificar la contraseña al hacer login.
- El service usa `jsonwebtoken` para crear el JWT y devolverlo al controller, que lo envía al frontend.

Ejemplo básico para el registro:

```js
const bcrypt = require('bcrypt');
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
// Guardar hashedPassword en la base de datos (esto lo hace el service antes de llamar al repository)
```

Ejemplo básico para login y generación de JWT:

```js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const isMatch = await bcrypt.compare(plainPassword, hashedPasswordFromDB);
if (isMatch) {
   const token = jwt.sign({ userId: usuario.id }, 'tu_clave_secreta', { expiresIn: '1h' });
   // El service retorna el token al controller, que lo envía al frontend
}
```


### 3. Proteger rutas en el Backend

Para proteger rutas, crea un **middleware** que verifique el JWT antes de acceder a rutas privadas. El middleware se coloca en las rutas que requieren autenticación.

```js
const jwt = require('jsonwebtoken');
function authMiddleware(req, res, next) {
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];
   if (!token) return res.status(401).json({ success: false, error: 'Token requerido' });
   jwt.verify(token, 'tu_clave_secreta', (err, user) => {
      if (err) return res.status(403).json({ success: false, error: 'Token inválido' });
      req.user = user; // El usuario autenticado queda disponible en req.user
      next(); // next() permite que la petición continúe hacia el controlador
   });
}

module.exports = authMiddleware;
```

**¿Qué hace `next()`?**
- Si el token es válido, `next()` llama al siguiente middleware o al controlador de la ruta.
- Si hay error, responde y no llama a `next()`, cortando el flujo.

**Ejemplo de uso en rutas:**

```js
const express = require('express');
const router = express.Router();
const authMiddleware = require('./authMiddleware');
const usuarioController = require('../controllers/usuarioController');

router.get('/me', authMiddleware, usuarioController.me); // Solo usuarios autenticados
router.get('/equipos', authMiddleware, equiposController.listarEquiposUsuario); // Protegida
```

---

### 4. Uso desde el Frontend

**¿Cómo enviar el token JWT en cada petición protegida?**

1. Guarda el token JWT en localStorage, sessionStorage o una cookie segura tras el login.
2. En cada petición a rutas protegidas, añade el token en la cabecera `Authorization`:

```js
fetch('/api/equipos', {
   method: 'GET',
   headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
   }
})
```

**¿Qué pasa si el token no es válido o falta?**
- El backend responde con `{ success: false, error: 'Token requerido' }` o `{ success: false, error: 'Token inválido' }`.
- El frontend debe manejar estos errores, por ejemplo, redirigiendo al login o mostrando un mensaje.

**Resumen del flujo protegido:**
1. El frontend envía el JWT en la cabecera.
2. El backend verifica el JWT en el middleware.
3. Si es válido, el middleware llama a `next()` y la petición llega al controlador.
4. Si no, responde con error y no continúa el flujo.

### 4. Frontend

- Guarda el token JWT recibido tras el login.
- En cada petición a rutas protegidas, envía el JWT en la cabecera `Authorization`.

Ejemplo de cabecera:

```
Authorization: Bearer <tu_token>
```

---

Adapta estos ejemplos a tus archivos en `src/services/`, `src/controllers/`, `src/routes/` y el frontend que uses.