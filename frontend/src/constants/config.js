export const CONFIG = {
  API_BASE_URL: 'http://localhost:3000/api',
  APP_NAME: 'PokedexLab',
  
  // Configuración de paginación
  PAGINATION: {
    DEFAULT_LIMIT: 20,
    DEFAULT_PAGE: 1,
  },
  
  // Configuración de caché (en milisegundos)
  CACHE: {
    DEFAULT_TTL: 5 * 60 * 1000, // 5 minutos
    SHORT_TTL: 60 * 1000, // 1 minuto
    LONG_TTL: 30 * 60 * 1000, // 30 minutos
  },
};