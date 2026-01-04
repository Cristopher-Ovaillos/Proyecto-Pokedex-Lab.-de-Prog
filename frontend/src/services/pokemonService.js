import { apiRequest } from '../api/apiAdapter';

export const pokemonService = {
  // Acción: Obtener lista de pokemons
  getPokemonList: (limit = 20, page = 1) => {
    return apiRequest(`/enciclopedia/pokemon?limit=${limit}&page=${page}`);
  },
  
  // Acción: Obtener detalle
  getPokemonDetail: (id) => {
    return apiRequest(`/enciclopedia/pokemon/${id}`);
  }
};