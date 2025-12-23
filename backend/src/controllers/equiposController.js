const equiposService = require('../services/equipoService');

// funcion para determinar codigo de error http
function getHttpStatus(errorMessage) {
    if (errorMessage.includes('VALIDATION_ERROR')) return 400;
    if (errorMessage.includes('NOT_FOUND_ERROR')) return 404;
    if (errorMessage.includes('CONFLICT_ERROR')) return 409;
    if (errorMessage.includes('AUTH_ERROR')) return 401; // cuando se implemente autenticacion
    if (errorMessage.includes('FORBIDDEN_ERROR')) return 403; // cuando se imlemente permisos
    return 500;
}

class EquiposController {
    
    // lista equipos de un usuario
    async listarEquiposUsuario(req, res) {
        try {
            const idUsuarioUrl = req.params.id_usuario;
            // nota: cuando tengas autenticacion, aqui obtienes el usuario logueado
            // const usuarioLogueadoId = req.user.id; // desde middleware de autenticacion
            const usuarioLogueadoId = 1; // temporal - simula usuario logueado

            const result = await equiposService.getEquiposByUsuario(idUsuarioUrl, usuarioLogueadoId);
            res.status(200).json(result);
        } catch (error) {
            const status = getHttpStatus(error.message);
            res.status(status).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // crea un nuevo equipo (solo cabecera)
    async crearEquipo(req, res) {
        try {
            const equipoData = {
                nombre: req.body.nombre,
                // con  autenticacion, el id_usuario viene del token, no del body
                // id_usuario: req.user.id
                id_usuario: req.body.id_usuario || 1 // temp
            };

            const result = await equiposService.crearEquipo(equipoData);
            res.status(201).json(result);
        } catch (error) {
            const status = getHttpStatus(error.message);
            res.status(status).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // obtiene detalle completo de un equipo
    async obtenerEquipo(req, res) {
        try {
            const equipoId = req.params.id;
            // cuando tengas autenticacion, valida que el usuario pueda ver este equipo
            // const usuarioLogueadoId = req.user.id;
            const usuarioLogueadoId = 1; // temporal

            const result = await equiposService.getEquipoById(equipoId, usuarioLogueadoId);
            res.status(200).json(result);
        } catch (error) {
            const status = getHttpStatus(error.message);
            res.status(status).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // actualiza equipo (nombre y/o integrantes)
    async actualizarEquipo(req, res) {
        try {
            const equipoId = req.params.id;
            const datosActualizacion = {
                nombre: req.body.nombre,
                integrantes: req.body.integrantes // array de pokemon con sus datos
            };
            // cuando tengas autenticacion:
            // const usuarioLogueadoId = req.user.id;
            const usuarioLogueadoId = 1; // temporal

            const result = await equiposService.actualizarEquipo(equipoId, datosActualizacion, usuarioLogueadoId);
            res.status(200).json(result);
        } catch (error) {
            const status = getHttpStatus(error.message);
            res.status(status).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // elimina equipo y todo lo relacionado
    async eliminarEquipo(req, res) {
        try {
            const equipoId = req.params.id;
            // cuando tengas autenticacion:
            // const usuarioLogueadoId = req.user.id;
            const usuarioLogueadoId = 1; // temporal

            const result = await equiposService.eliminarEquipo(equipoId, usuarioLogueadoId);
            res.status(200).json(result);
        } catch (error) {
            const status = getHttpStatus(error.message);
            res.status(status).json({ 
                success: false, 
                error: error.message 
            });
        }
    }
}

module.exports = new EquiposController();