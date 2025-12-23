# Usuarios y Autenticacion ()

POST	/api/auth/register	Registro de nuevo usuario.

POST	/api/auth/login	Login y generación de sesión/token.

GET	/api/auth/me	Datos del usuario autenticado.

# equipo

GET	/api/usuarios/:id_usuario/equipos	Lista los equipos de un usuario específico.
  - Verifica en el Service que el id_usuario de la URL coincida con el usuario que está logueado (el de tu auth/me), para que un usuario no pueda ver los equipos de otro si no quieres que sean públicos.
POST	/api/equipos	Crea cabecera del equipo (usa this.lastID para devolver el ID).
GET	/api/equipos/:id	Detalle profundo de un equipo (JOINs con pokémon, movimientos, etc).
PUT	/api/equipos/:id	Actualiza nombre o integrantes (reemplaza equipo_pokemon).
DELETE	/api/equipos/:id	Elimina equipo y sus relaciones en cascada.

# Enciclopedia

GET	/api/pokemon	Listado con filtros: ?type=fire&search=pika&limit=20.
GET	/api/pokemon/:id	Stats base + tipos + habilidades posibles.
GET	/api/pokemon/:id/movimientos	Lista de movimientos que este pokémon puede aprender con filtro
GET /api/movimientos: Listado general con filtros
GET	/api/naturalezas	Lista de naturalezas y sus modificadores (+/-).
GET	/api/habilidades	Diccionario general de habilidades.