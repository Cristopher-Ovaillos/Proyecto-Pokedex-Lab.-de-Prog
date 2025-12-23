const enciclopediaRepository = require('../repositories/enciclopediaRepository');

class EnciclopediaService {

    // 1. Listar Pokémon con filtros
    async getPokemonList(filters = {}) {
        try {
            // Valores por defecto
            const {
                type = null,
                search = null,
                limit = 20,
                page = 1,
                min_hp = null,
                max_hp = null,
                sort = 'id_pokemon',
                order = 'asc'
            } = filters;

            // Validaciones
            if (limit < 1 || limit > 100) {
                throw new Error("VALIDATION_ERROR: El límite debe estar entre 1 y 100");
            }

            if (page < 1) {
                throw new Error("VALIDATION_ERROR: La página debe ser mayor a 0");
            }

            // Calcular offset
            const offset = (page - 1) * limit;

            // Validar tipo si existe
            const tiposValidos = ['normal', 'fire', 'water', 'electric', 'grass', 'ice',
                'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
                'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];

            if (type && !tiposValidos.includes(type.toLowerCase())) {
                throw new Error(`VALIDATION_ERROR: Tipo '${type}' no válido. Tipos válidos: ${tiposValidos.join(', ')}`);
            }

            // Llamar al repositorio
            const result = await enciclopediaRepository.findAll({
                type: type ? type.toLowerCase() : null,
                search,
                limit: parseInt(limit),
                offset,
                min_hp: min_hp ? parseInt(min_hp) : null,
                max_hp: max_hp ? parseInt(max_hp) : null,
                sort,
                order: order.toLowerCase()
            });

            return {
                success: true,
                data: result.data,
                meta: {
                    pagination: result.pagination
                }
            };

        } catch (error) {
            console.error(`[EnciclopediaService Error]: ${error.message}`);
            throw error;
        }
    }

    // 2. Obtener detalles de un Pokémon
    async getPokemonById(id) {
        try {
            // Validar ID
            const pokemonId = parseInt(id);
            if (isNaN(pokemonId) || pokemonId < 1) {
                throw new Error("VALIDATION_ERROR: ID de Pokémon inválido");
            }

            // Obtener datos
            const pokemon = await enciclopediaRepository.findPokemonById(pokemonId);

            if (!pokemon) {
                throw new Error("NOT_FOUND_ERROR: Pokémon no encontrado");
            }

            return {
                success: true,
                data: pokemon
            };

        } catch (error) {
            console.error(`[EnciclopediaService Error]: ${error.message}`);
            throw error;
        }
    }

    // 3. Obtener movimientos de un Pokémon
    async getPokemonMoves(pokemonId, filters = {}) {
        try {
            // Validar ID
            const id = parseInt(pokemonId);
            if (isNaN(id) || id < 1) {
                throw new Error("VALIDATION_ERROR: ID de Pokémon inválido");
            }

            // Valores por defecto y validaciones de filtros
            const {
                level = null,
                method = null,
                type = null,
                category = null,
                min_power = null,
                max_power = null
            } = filters;

            // Validar nivel si existe
            if (level && (level < 1 || level > 100)) {
                throw new Error("VALIDATION_ERROR: El nivel debe estar entre 1 y 100");
            }

            // Validar método de aprendizaje si existe
            const metodosValidos = ['nivel', 'mt', 'hm', 'huevo', 'tutor'];
            if (method && !metodosValidos.includes(method.toLowerCase())) {
                throw new Error(`VALIDATION_ERROR: Método de aprendizaje '${method}' no válido`);
            }

            // Validar categoría si existe
            const categoriasValidas = ['físico', 'especial', 'estado'];
            if (category && !categoriasValidas.includes(category.toLowerCase())) {
                throw new Error(`VALIDATION_ERROR: Categoría '${category}' no válida`);
            }

            // Obtener movimientos
            const moves = await enciclopediaRepository.findMovesByPokemonId(id, {
                level: level ? parseInt(level) : null,
                method: method ? method.toLowerCase() : null,
                type: type ? type.toLowerCase() : null,
                category: category ? category.toLowerCase() : null,
                min_power: min_power ? parseInt(min_power) : null,
                max_power: max_power ? parseInt(max_power) : null
            });
            // Verificar si el Pokémon existe
            if (moves.length === 0) {
                const pokemonExists = await enciclopediaRepository.findPokemonById(id);
                if (!pokemonExists) {
                    throw new Error("NOT_FOUND_ERROR: Pokémon no encontrado");
                }
            }

            return {
                success: true,
                data: moves,
                meta: {
                    count: moves.length,
                    pokemon_id: id
                }
            };

        } catch (error) {
            console.error(`[EnciclopediaService Error]: ${error.message}`);
            throw error;
        }
    }

    // 4. Listar movimientos generales
    async getMovesList(filters = {}) {
        try {
            // Valores por defecto
            const {
                type = null,
                category = null,
                min_power = null,
                max_power = null,
                min_accuracy = null,
                max_accuracy = null,
                search = null,
                limit = 50,
                page = 1
            } = filters;

            // Validaciones
            if (limit < 1 || limit > 100) {
                throw new Error("VALIDATION_ERROR: El límite debe estar entre 1 y 100");
            }

            if (page < 1) {
                throw new Error("VALIDATION_ERROR: La página debe ser mayor a 0");
            }

            // Calcular offset
            const offset = (page - 1) * limit;

            // Validar categoría si existe
            const categoriasValidas = ['físico', 'especial', 'estado'];
            if (category && !categoriasValidas.includes(category.toLowerCase())) {
                throw new Error(`VALIDATION_ERROR: Categoría '${category}' no válida`);
            }

            // Validar precisión si existe
            if (min_accuracy && (min_accuracy < 0 || min_accuracy > 100)) {
                throw new Error("VALIDATION_ERROR: La precisión mínima debe estar entre 0 y 100");
            }

            if (max_accuracy && (max_accuracy < 0 || max_accuracy > 100)) {
                throw new Error("VALIDATION_ERROR: La precisión máxima debe estar entre 0 y 100");
            }

            // Obtener movimientos
            const result = await enciclopediaRepository.findAllMoves({
                type: type ? type.toLowerCase() : null,
                category: category ? category.toLowerCase() : null,
                min_power: min_power ? parseInt(min_power) : null,
                max_power: max_power ? parseInt(max_power) : null,
                min_accuracy: min_accuracy ? parseInt(min_accuracy) : null,
                max_accuracy: max_accuracy ? parseInt(max_accuracy) : null,
                search,
                limit: parseInt(limit),
                offset
            });

            return {
                success: true,
                data: result.data,
                meta: {
                    pagination: result.pagination
                }
            };

        } catch (error) {
            console.error(`[EnciclopediaService Error]: ${error.message}`);
            throw error;
        }
    }

    // 5. Listar naturalezas
    async getNaturesList() {
        try {
            const natures = await enciclopediaRepository.findAllNatures();

            return {
                success: true,
                data: natures,
                meta: {
                    count: natures.length
                }
            };

        } catch (error) {
            console.error(`[EnciclopediaService Error]: ${error.message}`);
            throw error;
        }
    }

    // 6. Listar habilidades
    async getAbilitiesList(filters = {}) {
        try {
            // Valores por defecto
            const {
                search = null,
                limit = 100,
                page = 1
            } = filters;

            // Validaciones
            if (limit < 1 || limit > 200) {
                throw new Error("VALIDATION_ERROR: El límite debe estar entre 1 y 200");
            }

            if (page < 1) {
                throw new Error("VALIDATION_ERROR: La página debe ser mayor a 0");
            }

            // Calcular offset
            const offset = (page - 1) * limit;

            // Obtener habilidades
            const result = await enciclopediaRepository.findAllAbilities({
                search,
                limit: parseInt(limit),
                offset
            });

            return {
                success: true,
                data: result.data,
                meta: {
                    pagination: result.pagination
                }
            };

        } catch (error) {
            console.error(`[EnciclopediaService Error]: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new EnciclopediaService();
