// Configuracion centralizada para variables de entorno y URLs
export const ENV = {
  API_URL: 'IP:3000/api', 
  TIMEOUT: 15000,
};

export const ENDPOINTS = {
  // --- USUARIO / AUTH ---
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROTECTED: '/auth/protected', // Requiere Token
  },

    // --- USUARIO / PERFIL ---
  USUARIOS: {
    UPDATE_USERNAME: '/auth/username',
    UPDATE_EMAIL: '/auth/email',
    UPDATE_PASSWORD: '/auth/password',
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