const pokemonRepository = require('../repositories/pokemonRepository');

class PokemonService {
    async getPokedexList(queryParams) {
        // (Valores por defecto)
        const page = parseInt(queryParams.page) || 1;
        const limit = parseInt(queryParams.limit) || 20;
        const offset = (page - 1) * limit;

        // 2. Llamada al repositorio
        const { data, total } = await pokemonRepository.findAll({
            limit,
            offset,
            type: queryParams.type,
            search: queryParams.search
        });

    
        const formattedData = data.map(p => ({
            id: p.id_pokemon,
            nombre: p.nombre, 
            tipos: [p.tipo_1, p.tipo_2].filter(Boolean),
            estadisticas: {
                hp_base: p.hp_base,
                ataque_base: p.ataque_base,
                ataque_especial_base: p.ataque_especial_base,
                defensa_base: p.defensa_base,
               defense_especial_base: p.defensa_especial_base,
               velocidad_base: p.velocidad_base  
            }
        }));

        // 4. Retornamos objeto con metadatos de paginación
        return {
            info: {
                total_items: total,
                total_pages: Math.ceil(total / limit),
                current_page: page,
                items_per_page: limit
            },
            results: formattedData
        };
    }

    
  async getPokemon(idOrQuery) { 
    try {
        const id = typeof idOrQuery === 'object' ? idOrQuery.id : idOrQuery;

        if (!id) {
            throw new Error("ID de pokemon no proporcionado");
        }

        // pokemon con sus datos.
        const pokemon = await pokemonRepository.findOne(id);

        if (!pokemon) return null;


        return {
            id: pokemon.id,
            nombre: pokemon.nombre,
            tipos: pokemon.tipos,
            estadisticas: pokemon.estadisticas,
            //son arrays
            habilidades: pokemon.habilidades || [],
            movimientos: pokemon.movimientos || []
        };
    } catch (error) {
        console.error("Error en Service getPokemon:", error);
        throw error;
    }
}

}
module.exports = new PokemonService();