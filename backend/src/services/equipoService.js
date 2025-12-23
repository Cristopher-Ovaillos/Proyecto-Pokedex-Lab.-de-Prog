const equiposRepository = require('../repositories/equipoRepository');

class EquiposService {

    // lista equipos de un usuario especifico
    async getEquiposByUsuario(idUsuarioUrl, usuarioLogueadoId) {
        try {
            // validar ids
            const idUsuario = parseInt(idUsuarioUrl);
            if (isNaN(idUsuario) || idUsuario < 1) {
                throw new Error("VALIDATION_ERROR: id de usuario no valido");
            }

            // cuando se implemente autenticacion, descomentar esto
            // verificar que el usuario solo pueda ver sus propios equipos
            // if (idUsuario !== usuarioLogueadoId) {
            //     throw new Error("FORBIDDEN_ERROR: no puedes ver los equipos de otro usuario");
            // }

            const equipos = await equiposRepository.findEquiposByUsuarioId(idUsuario);

            return {
                success: true,
                data: equipos,
                meta: {
                    count: equipos.length,
                    usuario_id: idUsuario
                }
            };

        } catch (error) {
            console.error(`[EquiposService Error]: ${error.message}`);
            throw error;
        }
    }

    // crea un nuevo equipo (solo cabecera)
    async crearEquipo(equipoData) {
        try {
            // validaciones basicas
            if (!equipoData.nombre || equipoData.nombre.trim() === '') {
                throw new Error("VALIDATION_ERROR: el nombre del equipo es requerido");
            }

            if (!equipoData.id_usuario) {
                throw new Error("VALIDATION_ERROR: id de usuario requerido");
            }

            const nombre = equipoData.nombre.trim();
            const idUsuario = parseInt(equipoData.id_usuario);

            if (isNaN(idUsuario) || idUsuario < 1) {
                throw new Error("VALIDATION_ERROR: id de usuario no valido");
            }

            // verificar que el usuario existe (opcional)
            const usuarioExiste = await equiposRepository.verificarUsuarioExiste(idUsuario);
            if (!usuarioExiste) {
                throw new Error("NOT_FOUND_ERROR: usuario no encontrado");
            }

            // crear equipo
            const equipoId = await equiposRepository.createEquipo({
                nombre: nombre,
                id_usuario: idUsuario
            });

            return {
                success: true,
                data: {
                    id_equipo: equipoId,
                    nombre: nombre,
                    id_usuario: idUsuario,
                    mensaje: "equipo creado correctamente"
                }
            };

        } catch (error) {
            console.error(`[EquiposService Error]: ${error.message}`);
            throw error;
        }
    }

    // obtiene equipo con todos sus detalles
    async getEquipoById(equipoId, usuarioLogueadoId) {
        try {
            const id = parseInt(equipoId);
            if (isNaN(id) || id < 1) {
                throw new Error("VALIDATION_ERROR: id de equipo no valido");
            }

            // obtener cabecera del equipo
            const equipo = await equiposRepository.findEquipoById(id);
            if (!equipo) {
                throw new Error("NOT_FOUND_ERROR: equipo no encontrado");
            }

            // cuando se mplementes autenticacion, descomentar
            // verificar que el equipo pertenece al usuario logueado
            // if (equipo.id_usuario !== usuarioLogueadoId) {
            //     throw new Error("FORBIDDEN_ERROR: no tienes permiso para ver este equipo");
            // }

            // obtener pokemons del equipo con sus detalles
            const pokemons = await equiposRepository.findPokemonsByEquipoId(id);

            return {
                success: true,
                data: {
                    equipo: equipo,
                    pokemons: pokemons,
                    total_pokemons: pokemons.length
                }
            };

        } catch (error) {
            console.error(`[EquiposService Error]: ${error.message}`);
            throw error;
        }
    }

    // actualiza equipo (nombre y/o integrantes)
    async actualizarEquipo(equipoId, datosActualizacion, usuarioLogueadoId) {
        try {
            const id = parseInt(equipoId);
            if (isNaN(id) || id < 1) {
                throw new Error("VALIDATION_ERROR: id de equipo no valido");
            }

            // verificar que el equipo existe
            const equipo = await equiposRepository.findEquipoById(id);
            if (!equipo) {
                throw new Error("NOT_FOUND_ERROR: equipo no encontrado");
            }

            // cuando implementes autenticacion:
            // if (equipo.id_usuario !== usuarioLogueadoId) {
            //     throw new Error("FORBIDDEN_ERROR: no tienes permiso para editar este equipo");
            // }

            let cambios = {};

            // si viene nombre, actualizarlo
            if (datosActualizacion.nombre) {
                const nombre = datosActualizacion.nombre.trim();
                if (nombre === '') {
                    throw new Error("VALIDATION_ERROR: el nombre no puede estar vacio");
                }
                cambios.nombre = nombre;
            }

            // si viene array de integrantes, reemplazar todo el equipo
            if (datosActualizacion.integrantes && Array.isArray(datosActualizacion.integrantes)) {
                // validar cada integrante
                for (let i = 0; i < datosActualizacion.integrantes.length; i++) {
                    const pokemon = datosActualizacion.integrantes[i];
                    
                    // validaciones basicas
                    if (!pokemon.id_pokemon || !pokemon.naturaleza_id || !pokemon.habilidad_id) {
                        throw new Error(`VALIDATION_ERROR: integrante ${i+1} falta informacion requerida`);
                    }

                    // validar que el pokemon existe
                    const pokemonExiste = await equiposRepository.verificarPokemonExiste(pokemon.id_pokemon);
                    if (!pokemonExiste) {
                        throw new Error(`VALIDATION_ERROR: pokemon con id ${pokemon.id_pokemon} no existe`);
                    }
                }

                // actualizar equipo (nombre si viene) y luego reemplazar pokemons
                const resultado = await equiposRepository.updateEquipoCompleto(id, cambios, datosActualizacion.integrantes);
                return {
                    success: true,
                    data: resultado
                };
            } else if (cambios.nombre) {
                // solo actualizar nombre
                const resultado = await equiposRepository.updateEquipo(id, cambios);
                return {
                    success: true,
                    data: resultado
                };
            } else {
                throw new Error("VALIDATION_ERROR: no hay datos para actualizar");
            }

        } catch (error) {
            console.error(`[EquiposService Error]: ${error.message}`);
            throw error;
        }
    }

    // elimina equipo y todas sus relaciones
    async eliminarEquipo(equipoId, usuarioLogueadoId) {
        try {
            const id = parseInt(equipoId);
            if (isNaN(id) || id < 1) {
                throw new Error("VALIDATION_ERROR: id de equipo no valido");
            }

            // verificar que el equipo existe
            const equipo = await equiposRepository.findEquipoById(id);
            if (!equipo) {
                throw new Error("NOT_FOUND_ERROR: equipo no encontrado");
            }

            // cuando se implemente autenticacion.
            // if (equipo.id_usuario !== usuarioLogueadoId) {
            //     throw new Error("FORBIDDEN_ERROR: no tienes permiso para eliminar este equipo");
            // }

            // eliminar equipo (cascada eliminara los pokemons del equipo)
            await equiposRepository.deleteEquipo(id);

            return {
                success: true,
                data: {
                    mensaje: "equipo eliminado correctamente",
                    equipo_id: id
                }
            };

        } catch (error) {
            console.error(`[EquiposService Error]: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new EquiposService();