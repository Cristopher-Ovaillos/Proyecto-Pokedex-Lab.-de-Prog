const enciclopediaRepository = require("../repositories/enciclopediaRepository");
const { BASE_URL, IMAGE_URL } = require("../shared/config");

const TIPOS_VALIDOS = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];
const METODOS_APRENDIZAJE_VALIDOS = ["level-up", "tm", "hm", "egg", "tutor"];
const CATEGORIAS_VALIDAS = ["physical", "special", "status"];

function validar(condicion, mensaje) {
  if (condicion) {
    throw new Error(`VALIDATION_ERROR: ${mensaje}`);
  }
}

class EnciclopediaService {
  async listarPokemons(queryParams) {
  try {
    const {
      type_1,
      type_2,
      search,
      limit = 20,
      page = 1,
      sort = "id_pokemon",
      order = "asc",
      ...stats
    } = queryParams;

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    validar(
      parsedLimit < 1 || parsedLimit > 100,
      "El límite debe estar entre 1 y 100",
    );

    validar(parsedPage < 1, "La página debe ser mayor a 0");

    if (type_1)
      validar(
        !TIPOS_VALIDOS.includes(type_1.toLowerCase()),
        `Tipo '${type_1}' no válido`,
      );

    if (type_2)
      validar(
        !TIPOS_VALIDOS.includes(type_2.toLowerCase()),
        `Tipo '${type_2}' no válido`,
      );

    const filters = {
      limit: parsedLimit,
      offset: (parsedPage - 1) * parsedLimit,
      type_1: type_1 ? type_1.toLowerCase() : null,
      type_2: type_2 ? type_2.toLowerCase() : null,
      search,
      sort,
      order: order ? order.toLowerCase() : "asc",
    };

    [
      "hp",
      "ataque",
      "defensa",
      "ataque_especial",
      "defensa_especial",
      "velocidad",
    ].forEach((stat) => {
      if (stats[`min_${stat}`])
        filters[`min_${stat}`] = parseInt(stats[`min_${stat}`]);

      if (stats[`max_${stat}`])
        filters[`max_${stat}`] = parseInt(stats[`max_${stat}`]);
    });

    const result = await enciclopediaRepository.buscarPokemons(filters);

    const dataConImagenes = result.data.map((pokemon) => ({
      ...pokemon,
      imagenUrl: `${IMAGE_URL}/${pokemon.id_pokemon}.png`,
    }));

    return {
      data: dataConImagenes,
      meta: {
        pagination: {
          total: result.total,
          page: parsedPage,
          limit: parsedLimit,
          totalPages: Math.ceil(result.total / parsedLimit),
        },
      },
    };

  } catch (error) {
    console.error(`[EnciclopediaService Error]: ${error.message}`);
    throw error;
  }
}

  async obtenerPokemonPorId(id) {
    try {
      const pokemonId = parseInt(id);
      validar(isNaN(pokemonId) || pokemonId < 1, "ID de Pokémon inválido");

      const pokemon =
        await enciclopediaRepository.buscarPokemonPorId(pokemonId);
      validar(!pokemon, "NOT_FOUND_ERROR: Pokémon no encontrado");

      pokemon.imagenUrl = `${IMAGE_URL}/${pokemon.id_pokemon}.png`;

      return { data: pokemon };
    } catch (error) {
      console.error(`[EnciclopediaService Error]: ${error.message}`);
      throw error;
    }
  }

  async obtenerMovimientosDePokemon(pokemonId, queryParams) {
    try {
      const id = parseInt(pokemonId);
      validar(isNaN(id) || id < 1, "ID de Pokémon inválido");

      const { level, method, type, category, min_power, max_power } =
        queryParams;

      const parsedLevel = level ? parseInt(level) : null;
      if (parsedLevel)
        validar(
          parsedLevel < 1 || parsedLevel > 100,
          "El nivel debe estar entre 1 y 100",
        );
      if (method)
        validar(
          !METODOS_APRENDIZAJE_VALIDOS.includes(method.toLowerCase()),
          `Método de aprendizaje '${method}' no válido`,
        );
      if (type)
        validar(
          !TIPOS_VALIDOS.includes(type.toLowerCase()),
          `Tipo '${type}' no válido`,
        );
      if (category)
        validar(
          !CATEGORIAS_VALIDAS.includes(category.toLowerCase()),
          `Categoría '${category}' no válida`,
        );

      const filters = {
        level: parsedLevel,
        method: method ? method.toLowerCase() : null,
        type: type ? type.toLowerCase() : null,
        category: category ? category.toLowerCase() : null,
        min_power: min_power ? parseInt(min_power) : null,
        max_power: max_power ? parseInt(max_power) : null,
      };

      const moves = await enciclopediaRepository.buscarMovimientosDePokemon(
        id,
        filters,
      );

      if (moves.length === 0) {
        const pokemonExists =
          await enciclopediaRepository.buscarPokemonPorId(id);
        validar(!pokemonExists, "NOT_FOUND_ERROR: Pokémon no encontrado");
      }

      return {
        data: moves,
        meta: {
          count: moves.length,
          pokemon_id: id,
        },
      };
    } catch (error) {
      console.error(`[EnciclopediaService Error]: ${error.message}`);
      throw error;
    }
  }

  async listarMovimientos(queryParams) {
    try {
      const {
        type,
        category,
        min_power,
        max_power,
        min_accuracy,
        max_accuracy,
        search,
        limit = 50,
        page = 1,
      } = queryParams;

      const parsedLimit = parseInt(limit);
      const parsedPage = parseInt(page);

      validar(
        parsedLimit < 1 || parsedLimit > 100,
        "El límite debe estar entre 1 y 100",
      );
      validar(parsedPage < 1, "La página debe ser mayor a 0");
      if (category)
        validar(
          !CATEGORIAS_VALIDAS.includes(category.toLowerCase()),
          `Categoría '${category}' no válida`,
        );
      if (min_accuracy)
        validar(
          parseInt(min_accuracy) < 0 || parseInt(min_accuracy) > 100,
          "La precisión mínima debe estar entre 0 y 100",
        );
      if (max_accuracy)
        validar(
          parseInt(max_accuracy) < 0 || parseInt(max_accuracy) > 100,
          "La precisión máxima debe estar entre 0 y 100",
        );

      const filters = {
        type: type ? type.toLowerCase() : null,
        category: category ? category.toLowerCase() : null,
        min_power: min_power ? parseInt(min_power) : null,
        max_power: max_power ? parseInt(max_power) : null,
        min_accuracy: min_accuracy ? parseInt(min_accuracy) : null,
        max_accuracy: max_accuracy ? parseInt(max_accuracy) : null,
        search,
        limit: parsedLimit,
        offset: (parsedPage - 1) * parsedLimit,
      };

      const result = await enciclopediaRepository.buscarMovimientos(filters);

      return {
        data: result.data,
        meta: {
          pagination: {
            total: result.total,
            page: parsedPage,
            limit: parsedLimit,
            totalPages: Math.ceil(result.total / parsedLimit),
          },
        },
      };
    } catch (error) {
      console.error(`[EnciclopediaService Error]: ${error.message}`);
      throw error;
    }
  }

  async obtenerMovimientoPorId(id) {
    try {
      const movimientoId = parseInt(id);
      validar(
        isNaN(movimientoId) || movimientoId < 1,
        "ID de movimiento inválido",
      );

      const movimiento =
        await enciclopediaRepository.buscarMovimientoPorId(movimientoId);
      validar(!movimiento, "NOT_FOUND_ERROR: Movimiento no encontrado");

      return { data: movimiento };
    } catch (error) {
      console.error(`[EnciclopediaService Error]: ${error.message}`);
      throw error;
    }
  }

  async getPokemonsByMoveId(id_movimiento, limit, page) {
    try {
      const moveId = parseInt(id_movimiento);
      if (isNaN(moveId) || moveId < 1) {
        throw new Error("VALIDATION_ERROR: ID de movimiento inválido");
      }

      const parsedLimit = limit ? parseInt(limit) : 10;
      const parsedPage = page ? parseInt(page) : 1;

      if (parsedLimit < 1 || parsedLimit > 100) {
        throw new Error("VALIDATION_ERROR: limit inválido");
      }

      if (parsedPage < 1) {
        throw new Error("VALIDATION_ERROR: page inválida");
      }

      const offset = (parsedPage - 1) * parsedLimit;

      const result = await enciclopediaRepository.findPokemonsByMoveId(
        moveId,
        parsedLimit,
        offset,
      );

      return {
        success: true,
        data: result.data,
        meta: {
          pagination: result.pagination,
        },
      };
    } catch (error) {
      console.error(`[EnciclopediaService Error]: ${error.message}`);
      throw error;
    }
  }

  async listarNaturalezas() {
    try {
      const natures = await enciclopediaRepository.buscarNaturalezas();
      return {
        data: natures,
        meta: { count: natures.length },
      };
    } catch (error) {
      console.error(`[EnciclopediaService Error]: ${error.message}`);
      throw error;
    }
  }

  async listarHabilidades(queryParams) {
    try {
      const { search, limit = 100, page = 1 } = queryParams;

      const parsedLimit = parseInt(limit);
      const parsedPage = parseInt(page);

      validar(
        parsedLimit < 1 || parsedLimit > 200,
        "El límite debe estar entre 1 y 200",
      );
      validar(parsedPage < 1, "La página debe ser mayor a 0");

      const filters = {
        search,
        limit: parsedLimit,
        offset: (parsedPage - 1) * parsedLimit,
      };

      const result = await enciclopediaRepository.buscarHabilidades(filters);

      return {
        data: result.data,
        meta: {
          pagination: {
            total: result.total,
            page: parsedPage,
            limit: parsedLimit,
            totalPages: Math.ceil(result.total / parsedLimit),
          },
        },
      };
    } catch (error) {
      console.error(`[EnciclopediaService Error]: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new EnciclopediaService();
