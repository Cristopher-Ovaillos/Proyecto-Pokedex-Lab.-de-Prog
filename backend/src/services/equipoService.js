const equipoRepository = require('../repositories/equipoRepository');

//validaciones se hace en service
class EquipoService {
     //---
    async createTeam(bodyTeam) {
        try {
            const nombre = bodyTeam.nombre?.trim();
            const id_usuario = bodyTeam.id_usuario;

            // validacion
            if (!nombre || nombre.length < 3) {
                throw new Error("VALIDATION_ERROR: El nombre debe tener al menos 3 caracteres.");
            }
            if (!id_usuario) {
                throw new Error("VALIDATION_ERROR: El ID de usuario es obligatorio.");
            }
            // llamamos al repositorio y esperamos (await) el resultado del INSERT
            const equipo = await equipoRepository.create({ nombre, id_usuario });

            if (!equipo) return null;

            // Devolvemos un objeto limpio para el controlador
            return {
                success: true,
                message: "Equipo creado exitosamente",
                data: {
                    id: equipo.id_equipo,
                    nombre: equipo.nombre,
                    propietario: equipo.id_usuario,
                    creado_el: equipo.fecha
                }
            };

        } catch (error) {
            // Registro del error para el desarrollador
            console.error(`[EquipoService Error]: ${error.message}`);
            // Re-lanzamos el error para que el Controlador lo capture y decida el Status Code (400 o 500)
            throw error;
        }
    }
    //---

}

module.exports = new EquipoService();