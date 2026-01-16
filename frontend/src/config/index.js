// Configuracion centralizada para variables de entorno y URLs
export const ENV = {
  API_URL: 'http://192.168.1.59:3000/api', 
  TIMEOUT: 15000,
};

export const ENDPOINTS = {
  //USUARIO
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROTECTED: '/auth/me', // Requiere Token
  },

  //ENCICLOPEDIA
  ENCICLOPEDIA: {
    POKEMONS: '/enciclopedia/pokemon', // Sirve para lista, búsqueda y filtros
    POKEMON_DETAIL: (id) => `/enciclopedia/pokemon/${id}`,
    POKEMON_MOVIMIENTOS: (id) => `/enciclopedia/pokemon/${id}/movimientos`,
    MOVIMIENTOS: '/enciclopedia/movimientos',
    NATURALEZAS: '/enciclopedia/naturalezas',
    HABILIDADES: '/enciclopedia/habilidades',
  },

  // EQUIPOS

  EQUIPOS: {
    POR_USUARIO: (id_usuario) => `/usuarios/${id_usuario}/equipos`,
    BASE: '/equipos', // POST para crear
    DETALLE: (id) => `/equipos/${id}`, // GET para obtener uno
    ACTUALIZAR_EQUIPO: (id_team) => `/equipos/${id_team}`, // PUT completo
    ELIMINAR_EQUIPO: (id_team) => `/equipos/${id_team}`,
    // pokemon dentro del equipo
    AGREGAR_POKEMON: (id_team) => `/equipos/${id_team}/pokemon`,
    POKEMON_INDIVIDUAL: (id_team, pokemon_equipo_id) => 
      `/equipos/${id_team}/pokemon/${pokemon_equipo_id}`,
    AGREGAR_MOVIMIENTO: (id_team, pokemon_equipo_id) => 
      `/equipos/${id_team}/pokemon/${pokemon_equipo_id}/movimientos`,
    ELIMINAR_MOVIMIENTO: (id_team, pokemon_equipo_id, ranura) => 
      `/equipos/${id_team}/pokemon/${pokemon_equipo_id}/movimientos/${ranura}`,
  }
};