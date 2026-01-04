// Configuracion centralizada para variables de entorno y URLs
export const ENV = {
  API_URL: 'http://192.168.1.59:3000/api', // URL de desarrollo
  TIMEOUT: 15000,
};

export const ENDPOINTS = {
  // --- USUARIO / AUTH ---
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROTECTED: '/auth/protected', // Requiere Token
  },

  // --- ENCICLOPEDIA ---
  ENCICLOPEDIA: {
    POKEMONS: '/enciclopedia/pokemon', // Sirve para lista, búsqueda y filtros
    POKEMON_DETAIL: (id) => `/enciclopedia/pokemon/${id}`,
    POKEMON_MOVIMIENTOS: (id) => `/enciclopedia/pokemon/${id}/movimientos`,
    MOVIMIENTOS: '/enciclopedia/movimientos',
    NATURALEZAS: '/enciclopedia/naturalezas',
    HABILIDADES: '/enciclopedia/habilidades',
  },

  // --- EQUIPOS ---
  EQUIPOS: {
    POR_USUARIO: (id_usuario) => `/usuarios/${id_usuario}/equipos`,
    BASE: '/equipos', // Para POST (crear)
    DETALLE: (id) => `/equipos/${id}`, // Para GET, PUT y DELETE
  },
};