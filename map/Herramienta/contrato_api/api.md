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

GET /api/enciclopedia/pokemon
Filtros:
- type (string): Tipo de Pokémon (fire, water, grass, electric, etc.)
- search (string): Búsqueda por nombre (ej: pika, char, bulba)
- limit (number, default: 20): Resultados por página (1-100)
- page (number, default: 1): Número de página
- min_hp (number): HP base mínimo
- max_hp (number): HP base máximo
- sort (string): Ordenar por (id_pokemon, nombre, hp_base, ataque_base, defensa_base, velocidad_base)
- order (string): asc o desc
GET	/api/pokemon/:id	

GET	/api/pokemon/:id/movimientos
- level (number): Nivel máximo para aprender movimiento
- method (string): Método de aprendizaje (level, tm, hm, egg, tutor)
- type (string): Tipo de movimiento (fire, water, grass, etc.)
- category (string): Categoría (physical, special, status)
- min_power (number): Poder mínimo del movimiento
- max_power (number): Poder máximo del movimiento

GET /api/movimientos: Listado general con filtros
- type (string): Tipo de movimiento
- category (string): Categoría (physical, special, status)
- min_power (number): Poder mínimo
- max_power (number): Poder máximo
- min_accuracy (number, 0-100): Precisión mínima
- max_accuracy (number, 0-100): Precisión máxima
- search (string): Búsqueda por nombre
- limit (number, default: 50): Resultados por página
- page (number, default: 1): Número de página

GET	/api/naturalezas	Lista de naturalezas y sus modificadores (+/-).

GET	/api/habilidades	Diccionario general de habilidades.
- search (string): Búsqueda por nombre
- limit (number, default: 100): Resultados por página
- page (number, default: 1): Número de página