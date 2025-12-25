const enciclopediaRepository = require('../repositories/enciclopediaRepository');
//para la url de las imagenes
const URL = require('../shared/config');

class EnciclopediaService {

    async getPokemonList(type, search, limit, page, min_hp, max_hp, sort, order) {
        try {
            //parsed para usar convertir datos
            const parsedLimit = limit ? parseInt(limit) : 20;
            const parsedPage = page ? parseInt(page) : 1;
            const parsedMinHp = min_hp ? parseInt(min_hp) : null;
            const parsedMaxHp = max_hp ? parseInt(max_hp) : null;

            if (parsedLimit < 1 || parsedLimit > 100) {
                throw new Error("VALIDATION_ERROR: El límite debe estar entre 1 y 100");
            }

            if (parsedPage < 1) {
                throw new Error("VALIDATION_ERROR: La página debe ser mayor a 0");
            }

            const offset = (parsedPage - 1) * parsedLimit;

            if (type) {
                const tiposValidos = ['normal', 'fire', 'water', 'electric', 'grass', 'ice',
                    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
                    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];

                if (!tiposValidos.includes(type.toLowerCase())) {
                    throw new Error(`VALIDATION_ERROR: Tipo '${type}' no válido`);
                }
            }
            //envio los campos
            const result = await enciclopediaRepository.findAll(
                parsedLimit,
                offset,
                type ? type.toLowerCase() : null,
                search,
                parsedMinHp,
                parsedMaxHp,
                sort || 'id_pokemon',
                order ? order.toLowerCase() : 'asc'
            );
            //aniado el link, uso de Spread Operator para simplificar (se accede a la data de una tupla y concateno la url)
            const dataConImagenes = result.data.map(p => ({
                ...p,
                imagenUrl: `${URL.BASE_URL}/pokemon/${p.id_pokemon}.png`
            }));

            return {
                success: true,
                data: dataConImagenes,
                meta: {
                    pagination: {
                        total: result.total,
                        page: parsedPage,
                        limit: parsedLimit,
                        totalPages: Math.ceil(result.total / parsedLimit)
                    }
                }
            };

        } catch (error) {
            console.error(`[EnciclopediaService Error]: ${error.message}`);
            throw error;
        }
    }

    async getPokemonById(id) {
        try {
            const pokemonId = parseInt(id);
            if (isNaN(pokemonId) || pokemonId < 1) {
                throw new Error("VALIDATION_ERROR: ID de Pokémon inválido");
            }

            const pokemon = await enciclopediaRepository.findPokemonById(pokemonId);


            if (!pokemon) {
                throw new Error("NOT_FOUND_ERROR: Pokémon no encontrado");
            }
            pokemon.imagenUrl = `${URL.BASE_URL}/pokemon/${pokemon.id}.png`;



            return {
                success: true,
                data: pokemon
            };

        } catch (error) {
            console.error(`[EnciclopediaService Error]: ${error.message}`);
            throw error;
        }
    }

    async getPokemonMoves(pokemonId, level, method, type, category, min_power, max_power) {
        try {
            const id = parseInt(pokemonId);
            if (isNaN(id) || id < 1) {
                throw new Error("VALIDATION_ERROR: ID de Pokémon inválido");
            }

            const parsedLevel = level ? parseInt(level) : null;
            if (parsedLevel && (parsedLevel < 1 || parsedLevel > 100)) {
                throw new Error("VALIDATION_ERROR: El nivel debe estar entre 1 y 100");
            }

            if (method) {
                const metodosValidos = ['level-up', 'tm', 'hm', 'egg', 'tutor'];
                if (!metodosValidos.includes(method.toLowerCase())) {
                    throw new Error(`VALIDATION_ERROR: Método de aprendizaje '${method}' no válido`);
                }
            }

            if (category) {
                const categoriasValidas = ['physical', 'special', 'status'];
                if (!categoriasValidas.includes(category.toLowerCase())) {
                    throw new Error(`VALIDATION_ERROR: Categoría '${category}' no válida`);
                }
            }

            const moves = await enciclopediaRepository.findMovesByPokemonId(
                id,
                parsedLevel,
                method ? method.toLowerCase() : null,
                type ? type.toLowerCase() : null,
                category ? category.toLowerCase() : null,
                min_power ? parseInt(min_power) : null,
                max_power ? parseInt(max_power) : null
            );

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

    async getMovesList(type, category, min_power, max_power, min_accuracy, max_accuracy, search, limit, page) {
        try {
            const parsedLimit = limit ? parseInt(limit) : 50;
            const parsedPage = page ? parseInt(page) : 1;
            const parsedMinPower = min_power ? parseInt(min_power) : null;
            const parsedMaxPower = max_power ? parseInt(max_power) : null;
            const parsedMinAccuracy = min_accuracy ? parseInt(min_accuracy) : null;
            const parsedMaxAccuracy = max_accuracy ? parseInt(max_accuracy) : null;

            if (parsedLimit < 1 || parsedLimit > 100) {
                throw new Error("VALIDATION_ERROR: El límite debe estar entre 1 y 100");
            }

            if (parsedPage < 1) {
                throw new Error("VALIDATION_ERROR: La página debe ser mayor a 0");
            }

            const offset = (parsedPage - 1) * parsedLimit;

            if (category) {
                const categoriasValidas = ['physical', 'special', 'status'];
                if (!categoriasValidas.includes(category.toLowerCase())) {
                    throw new Error(`VALIDATION_ERROR: Categoría '${category}' no válida`);
                }
            }

            if (parsedMinAccuracy && (parsedMinAccuracy < 0 || parsedMinAccuracy > 100)) {
                throw new Error("VALIDATION_ERROR: La precisión mínima debe estar entre 0 y 100");
            }

            if (parsedMaxAccuracy && (parsedMaxAccuracy < 0 || parsedMaxAccuracy > 100)) {
                throw new Error("VALIDATION_ERROR: La precisión máxima debe estar entre 0 y 100");
            }

            const result = await enciclopediaRepository.findAllMoves(
                type ? type.toLowerCase() : null,
                category ? category.toLowerCase() : null,
                parsedMinPower,
                parsedMaxPower,
                parsedMinAccuracy,
                parsedMaxAccuracy,
                search,
                parsedLimit,
                offset
            );

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

    async getAbilitiesList(search, limit, page) {
        try {
            const parsedLimit = limit ? parseInt(limit) : 100;
            const parsedPage = page ? parseInt(page) : 1;

            if (parsedLimit < 1 || parsedLimit > 200) {
                throw new Error("VALIDATION_ERROR: El límite debe estar entre 1 y 200");
            }

            if (parsedPage < 1) {
                throw new Error("VALIDATION_ERROR: La página debe ser mayor a 0");
            }

            const offset = (parsedPage - 1) * parsedLimit;

            const result = await enciclopediaRepository.findAllAbilities(
                search,
                parsedLimit,
                offset
            );

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