GET /pokemon
→ Lista todos (SELECT * FROM pokemon)
Query: ?search=pikachu&type=electric&page=1

GET /pokemon/:id
→ Detalle Pokémon + movimientos + habilidades

POST /equipos
→ Crea equipo (INSERT INTO equipo)

GET /equipos
→ Lista equipos usuario (SELECT * FROM equipo WHERE id_usuario = ?)

GET /equipos/:id
→ Obtiene equipo completo con todos los JOINs

PUT /equipos/:id
→ Actualiza equipo

DELETE /equipos/:id
→ Elimina equipo

GET /naturalezas
→ SELECT * FROM naturaleza

GET /habilidades
→ SELECT * FROM habilidades

GET /habilidades/pokemon/:id_pokemon
→ Habilidades de un Pokémon específico

GET /movimientos/pokemon/:id_pokemon
→ Movimientos que aprende un Pokémon

POST /auth/register
{
  "nombre_usuario": "ash",
  "contrasenia": "pikachu123",
  "email": "ash@pokemon.com"
}

POST /auth/login
{
  "nombre_usuario": "ash",
  "contrasenia": "pikachu123"
}

GET /auth/me (protegido)
→ Devuelve usuario actual

POST /calculator