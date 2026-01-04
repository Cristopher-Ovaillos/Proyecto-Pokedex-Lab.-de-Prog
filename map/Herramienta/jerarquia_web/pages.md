/
├── /auth/
│   ├── login
│   └── register
│
├── /dashboard/                    (Inicio)
│
├── /pokedex/                     (CONSULTA SOLO LECTURA)
│   ├── /                         (Lista Pokémon con filtros)
│   │   ├── ?search=char          (Búsqueda por nombre)
│   │   ├── ?type=fire            (Filtrar por tipo)
│   │   ├── ?generation=1         (Filtrar por generación 1-5)
│   │   ├── ?sort=name            (Ordenar por nombre/número/stats)
│   │   └── ?type1=fire&type2=flying (Filtrar por 2 tipos)
│   └── /:id                      (Detalle Pokémon BASE - sin EVs/IVs)
│       ├── /stats                (Estadísticas base de la especie)
│       ├── /moves                (Movimientos que puede aprender)
│       └── /abilities            (Habilidades disponibles)
│
├── /moves/                       (CONSULTA SOLO LECTURA)
│   ├── /                         (Lista Movimientos con filtros)
│   │   ├── ?search=flame         (Búsqueda por nombre)
│   │   └── ?type=fire            (Filtrar por tipo)
│   └── /:id                      (Detalle Movimiento)
│
├── /teams/                       (GESTIÓN DE MIS EQUIPOS - EDICIÓN)
│   ├── /                         (Lista de MIS equipos)
│   │   └── ?search=liga          (Buscar mis equipos por nombre)
│   ├── /new                      (Crear NUEVO equipo vacío)
│   └── /:teamId/
│       ├── /                     (Ver equipo completo con Pokémon configurados)
│       ├── /edit                 (Editar nombre del equipo)
│       ├── /delete               (Eliminar equipo completo)
│       ├── /pokemon/new          (Añadir nuevo Pokémon al equipo)
│       └── /pokemon/:pokemonId/
│           ├── /                 (Ver este Pokémon CONFIGURADO en el equipo)
│           │   ├── #evs-ivs      (Ver EVs/IVs aplicados)
│           │   ├── #moves        (Ver movimientos seleccionados)
│           │   ├── #ability      (Ver habilidad seleccionada)
│           │   └── #stats-final  (Ver stats FINALES con cálculos)
│           ├── /edit             (Editar configuración completa)
│           │   ├── #evs          (Ajustar EVs: 0-252 cada uno, total ≤ 510)
│           │   ├── #ivs          (Ajustar IVs: 0-31 cada uno)
│           │   ├── #nature       (Seleccionar naturaleza - afecta stats)
│           │   ├── #ability      (Seleccionar habilidad disponible)
│           │   └── #moves        (Seleccionar 4 movimientos)
│           └── /delete           (Eliminar este Pokémon del equipo)
│
├── /calculator/                  (HERRAMIENTA ADICIONAL)
│   └── /                         (Calculadora de stats con parámetros)
│
└── /profile/
    ├── /                         (Ver MI perfil)
    ├── /edit                     (Editar MI perfil)
    └── /password                 (Cambiar MI contraseña)

---
POST /auth/register
POST /auth/login
GET /me
PUT /me
PUT /me/password
GET /teams
POST /teams
GET /teams/{teamId}
PUT /teams/{teamId}
DELETE /teams/{teamId}
POST /teams/{teamId}/pokemon
GET /teams/{teamId}/pokemon/{pokemonId}
PUT /teams/{teamId}/pokemon/{pokemonId}
DELETE /teams/{teamId}/pokemon/{pokemonId}
GET /pokemon
GET /pokemon/{id}
GET /moves
GET /moves/{id}
GET /abilities
GET /abilities/{id}
GET /natures
POST /calculate