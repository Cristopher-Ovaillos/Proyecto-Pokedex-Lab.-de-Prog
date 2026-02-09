const equipoRepository = require('../repositories/equipoRepository');

function validar(condicion, mensaje) {
    if (condicion) {
        throw new Error(`VALIDATION_ERROR: ${mensaje}`);
    }
}

async function verificarPermiso(equipoId, usuarioLogueadoId) {
    const equipo = await equipoRepository.buscarPorId(equipoId);
    validar(!equipo, "NOT_FOUND_ERROR: Equipo no encontrado");
    validar(equipo.id_usuario !== usuarioLogueadoId, "FORBIDDEN_ERROR: No tienes permiso sobre este equipo");
    return equipo;
}

async function verificarPermisoPokemon(equipoId, pokemonEquipoId, usuarioLogueadoId) {
    const equipo = await verificarPermiso(equipoId, usuarioLogueadoId);
    const pokemon = await equipoRepository.buscarPokemonEquipoPorId(pokemonEquipoId);
    validar(!pokemon, "NOT_FOUND_ERROR: Pokémon no encontrado en el equipo");
    validar(pokemon.id_equipo !== equipo.id_equipo, "FORBIDDEN_ERROR: El pokémon no pertenece al equipo especificado");
    return { equipo, pokemon };
}


class EquipoService {

    async listarPorUsuario(idUsuario, usuarioLogueadoId) {
        try {
            const parsedId = parseInt(idUsuario);
            validar(isNaN(parsedId) || parsedId < 1, "ID de usuario no válido");
            validar(parsedId !== usuarioLogueadoId, "No puedes ver los equipos de otro usuario");

            const equipos = await equipoRepository.buscarPorIdUsuario(parsedId);
            return {
                data: equipos,
                meta: { count: equipos.length, usuario_id: parsedId }
            };
        } catch (error) {
            console.error(`[EquipoService Error]: ${error.message}`);
            throw error;
        }
    }

    async crear(equipoData, usuarioLogueadoId) {
        try {
            const { nombre, id_usuario, pokemons } = equipoData;
            validar(!nombre || nombre.trim() === '', "El nombre del equipo es requerido");
            validar(!id_usuario, "ID de usuario es requerido");

            const parsedIdUsuario = parseInt(id_usuario);
            validar(isNaN(parsedIdUsuario) || parsedIdUsuario < 1, "ID de usuario no válido");
            validar(parsedIdUsuario !== usuarioLogueadoId, "No puedes crear equipos para otro usuario");

            const usuarioExiste = await equipoRepository.verificarExistenciaUsuario(parsedIdUsuario);
            validar(!usuarioExiste, "NOT_FOUND_ERROR: Usuario no encontrado");

            // Validar pokemons si se envían
            if (pokemons && Array.isArray(pokemons)) {
                if (pokemons.length > 6) throw new Error("VALIDATION_ERROR: Un equipo no puede tener más de 6 pokémon");
                for (const p of pokemons) {
                    if (!p.id_pokemon) throw new Error("VALIDATION_ERROR: Falta id_pokemon en uno de los integrantes");
                    // Aquí se podrían agregar más validaciones como naturaleza, habilidad, etc.
                }
            }

            const equipoId = await equipoRepository.crear({
                nombre: nombre.trim(),
                id_usuario: parsedIdUsuario,
                pokemons: pokemons || []
            });

            return {
                data: { id_equipo: equipoId, nombre: nombre.trim(), id_usuario: parsedIdUsuario }
            };
        } catch (error) {
            console.error(`[EquipoService Error]: ${error.message}`);
            throw error;
        }
    }

    async obtenerPorId(equipoId, usuarioLogueadoId) {
        try {
            const id = parseInt(equipoId);
            validar(isNaN(id) || id < 1, "ID de equipo no válido");

            const equipo = await verificarPermiso(id, usuarioLogueadoId);
            const pokemons = await equipoRepository.buscarPokemonsPorId(id);

            return {
                data: { equipo, pokemons, total_pokemons: pokemons.length }
            };
        } catch (error) {
            console.error(`[EquipoService Error]: ${error.message}`);
            throw error;
        }
    }

    async actualizar(equipoId, datos, usuarioLogueadoId) {
        try {
            const id = parseInt(equipoId);
            validar(isNaN(id) || id < 1, "ID de equipo no válido");
            await verificarPermiso(id, usuarioLogueadoId);

            const { nombre, integrantes } = datos;
            validar(!nombre && !integrantes, "No hay datos para actualizar");

            if (integrantes && Array.isArray(integrantes)) {
                for (const p of integrantes) {
                    validar(!p.id_pokemon || !p.naturaleza_id || !p.habilidad_id, "Falta información requerida en uno de los integrantes");
                    const pokemonExiste = await equipoRepository.verificarExistenciaPokemon(p.id_pokemon);
                    validar(!pokemonExiste, `El Pokémon con ID ${p.id_pokemon} no existe`);
                }
                const resultado = await equipoRepository.actualizarCompleto(id, nombre, integrantes);
                return { data: { ...resultado, mensaje: "Equipo actualizado completamente" } };
            }

            if (nombre) {
                validar(nombre.trim() === '', "El nombre no puede estar vacío");
                await equipoRepository.actualizarNombre(id, nombre.trim());
                return { data: { id_equipo: id, nombre: nombre.trim(), mensaje: "Nombre del equipo actualizado" } };
            }
        } catch (error) {
            console.error(`[EquipoService Error]: ${error.message}`);
            throw error;
        }
    }

    async eliminar(equipoId, usuarioLogueadoId) {
        try {
            const id = parseInt(equipoId);
            validar(isNaN(id) || id < 1, "ID de equipo no válido");
            await verificarPermiso(id, usuarioLogueadoId);

            await equipoRepository.eliminar(id);
            return { data: { mensaje: "Equipo eliminado correctamente", id_equipo: id } };
        } catch (error) {
            console.error(`[EquipoService Error]: ${error.message}`);
            throw error;
        }
    }

    async actualizarPokemonDeEquipo(equipoId, pokemonEquipoId, datos, usuarioLogueadoId) {
        try {
            const idEquipo = parseInt(equipoId);
            const idPokemonEquipo = parseInt(pokemonEquipoId);
            validar(isNaN(idEquipo) || idEquipo < 1, "ID de equipo no válido");
            validar(isNaN(idPokemonEquipo) || idPokemonEquipo < 1, "ID de Pokémon de equipo no válido");

            await verificarPermisoPokemon(idEquipo, idPokemonEquipo, usuarioLogueadoId);

            const resultado = await equipoRepository.actualizarPokemon(idPokemonEquipo, datos);
            return { data: { ...resultado, mensaje: "Pokémon del equipo actualizado" } };
        } catch (error) {
            console.error(`[EquipoService Error]: ${error.message}`);
            throw error;
        }
    }

    async agregarMovimientoAEquipoPokemon(equipoId, pokemonEquipoId, idMovimiento, ranura, usuarioLogueadoId) {
        try {
            const idEquipo = parseInt(equipoId);
            const idPokemonEquipo = parseInt(pokemonEquipoId);
            const idMov = parseInt(idMovimiento);
            const numRanura = parseInt(ranura);

            validar(isNaN(idEquipo) || idEquipo < 1, "ID de equipo no válido");
            validar(isNaN(idPokemonEquipo) || idPokemonEquipo < 1, "ID de Pokémon de equipo no válido");
            validar(isNaN(idMov) || idMov < 1, "ID de movimiento no válido");
            validar(isNaN(numRanura) || numRanura < 1 || numRanura > 4, "La ranura del movimiento debe ser entre 1 y 4");

            await verificarPermisoPokemon(idEquipo, idPokemonEquipo, usuarioLogueadoId);

            // TODO: Validar que el movimiento existe y que el pokémon puede aprenderlo

            const resultado = await equipoRepository.agregarMovimiento(idPokemonEquipo, idMov, numRanura);
            return { data: { ...resultado, mensaje: `Movimiento en ranura ${numRanura} actualizado.` } };
        } catch (error) {
            console.error(`[EquipoService Error]: ${error.message}`);
            throw error;
        }
    }

    async eliminarMovimientoDeEquipoPokemon(equipoId, pokemonEquipoId, ranura, usuarioLogueadoId) {
        try {
            const idEquipo = parseInt(equipoId);
            const idPokemonEquipo = parseInt(pokemonEquipoId);
            const numRanura = parseInt(ranura);

            validar(isNaN(idEquipo) || idEquipo < 1, "ID de equipo no válido");
            validar(isNaN(idPokemonEquipo) || idPokemonEquipo < 1, "ID de Pokémon de equipo no válido");
            validar(isNaN(numRanura) || numRanura < 1 || numRanura > 4, "La ranura del movimiento debe ser entre 1 y 4");

            await verificarPermisoPokemon(idEquipo, idPokemonEquipo, usuarioLogueadoId);

            const resultado = await equipoRepository.eliminarMovimiento(idPokemonEquipo, numRanura);
            return { data: { ...resultado, mensaje: `Movimiento en ranura ${numRanura} eliminado.` } };

        } catch (error) {
            console.error(`[EquipoService Error]: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new EquipoService();