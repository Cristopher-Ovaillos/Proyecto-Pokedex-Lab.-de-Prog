const equipoService = require('../services/equipoService');

class EquipoController {

  async listarDeUsuario(req, res) {
    try {
        const usuarioLogueadoId = req.user.id_usuario; 
        if (parseInt(req.params.id_usuario) !== usuarioLogueadoId) {
            return res.status(403).json({ status: 'error', message: 'No tienes permiso para ver los equipos de otro usuario' });
        }
        const result = await equipoService.listarPorUsuario(req.params.id_usuario, usuarioLogueadoId);
        res.status(200).json({ status: 'success', ...result });
    } catch (error) {
        const [errorType, errorMessage] = error.message.split(': ');
        let statusCode = 500;
        if (errorType === 'VALIDATION_ERROR') statusCode = 400;
        if (errorType === 'FORBIDDEN_ERROR') statusCode = 403;
        res.status(statusCode).json({ status: 'error', message: errorMessage || error.message });
    }
  }

  async crear(req, res) {
    try {
        const usuarioLogueadoId = req.user.id_usuario; 
        req.body.id_usuario = usuarioLogueadoId;
        const result = await equipoService.crear(req.body, usuarioLogueadoId);
        res.status(201).json({ status: 'success', ...result });
    } catch (error) {
        const [errorType, errorMessage] = error.message.split(': ');
        let statusCode = 500;
        if (errorType === 'VALIDATION_ERROR') statusCode = 400;
        if (errorType === 'NOT_FOUND_ERROR') statusCode = 404;
        res.status(statusCode).json({ status: 'error', message: errorMessage || error.message });
    }
  }

  async obtenerPorId(req, res) {
    try {
        const usuarioLogueadoId = req.user.id_usuario;
        const result = await equipoService.obtenerPorId(req.params.id, usuarioLogueadoId);
        res.status(200).json({ status: 'success', ...result });
    } catch (error) {
        const [errorType, errorMessage] = error.message.split(': ');
        let statusCode = 500;
        if (errorType === 'VALIDATION_ERROR') statusCode = 400;
        if (errorType === 'NOT_FOUND_ERROR') statusCode = 404;
        if (errorType === 'FORBIDDEN_ERROR') statusCode = 403;
        res.status(statusCode).json({ status: 'error', message: errorMessage || error.message });
    }
  }

  async actualizar(req, res) {
    try {
        const usuarioLogueadoId = req.user.id_usuario;
        const result = await equipoService.actualizar(req.params.id, req.body, usuarioLogueadoId);
        res.status(200).json({ status: 'success', ...result });
    } catch (error) {
        const [errorType, errorMessage] = error.message.split(': ');
        let statusCode = 500;
        if (errorType === 'VALIDATION_ERROR') statusCode = 400;
        if (errorType === 'NOT_FOUND_ERROR') statusCode = 404;
        if (errorType === 'FORBIDDEN_ERROR') statusCode = 403;
        res.status(statusCode).json({ status: 'error', message: errorMessage || error.message });
    }
  }

  async eliminar(req, res) {
    try {
        const usuarioLogueadoId = req.user.id_usuario;
        const result = await equipoService.eliminar(req.params.id, usuarioLogueadoId);
        res.status(200).json({ status: 'success', ...result });
    } catch (error) {
        const [errorType, errorMessage] = error.message.split(': ');
        let statusCode = 500;
        if (errorType === 'VALIDATION_ERROR') statusCode = 400;
        if (errorType === 'NOT_FOUND_ERROR') statusCode = 404;
        if (errorType === 'FORBIDDEN_ERROR') statusCode = 403;
        res.status(statusCode).json({ status: 'error', message: errorMessage || error.message });
    }
  }

  async actualizarPokemonDeEquipo(req, res) {
    try {
        const { id, pokemon_equipo_id } = req.params;
        const usuarioLogueadoId = req.user.id_usuario;
        const result = await equipoService.actualizarPokemonDeEquipo(id, pokemon_equipo_id, req.body, usuarioLogueadoId);
        res.status(200).json({ status: 'success', ...result });
    } catch (error) {
        const [errorType, errorMessage] = error.message.split(': ');
        let statusCode = 500;
        if (errorType === 'VALIDATION_ERROR') statusCode = 400;
        if (errorType === 'NOT_FOUND_ERROR') statusCode = 404;
        if (errorType === 'FORBIDDEN_ERROR') statusCode = 403;
        res.status(statusCode).json({ status: 'error', message: errorMessage || error.message });
    }
  }

  async agregarMovimientoAEquipoPokemon(req, res) {
    try {
        const { id, pokemon_equipo_id } = req.params;
        const { id_movimiento, slot } = req.body;
        const usuarioLogueadoId = req.user.id_usuario;
        const result = await equipoService.agregarMovimientoAEquipoPokemon(id, pokemon_equipo_id, id_movimiento, slot, usuarioLogueadoId);
        res.status(200).json({ status: 'success', ...result });
    } catch (error) {
        const [errorType, errorMessage] = error.message.split(': ');
        let statusCode = 500;
        if (errorType === 'VALIDATION_ERROR') statusCode = 400;
        if (errorType === 'NOT_FOUND_ERROR') statusCode = 404;
        if (errorType === 'FORBIDDEN_ERROR') statusCode = 403;
        res.status(statusCode).json({ status: 'error', message: errorMessage || error.message });
    }
  }

  async eliminarMovimientoDeEquipoPokemon(req, res) {
    try {
        const { id, pokemon_equipo_id, slot } = req.params;
        const usuarioLogueadoId = req.user.id_usuario;
        const result = await equipoService.eliminarMovimientoDeEquipoPokemon(id, pokemon_equipo_id, slot, usuarioLogueadoId);
        res.status(200).json({ status: 'success', ...result });
    } catch (error) {
        const [errorType, errorMessage] = error.message.split(': ');
        let statusCode = 500;
        if (errorType === 'VALIDATION_ERROR') statusCode = 400;
        if (errorType === 'NOT_FOUND_ERROR') statusCode = 404;
        if (errorType === 'FORBIDDEN_ERROR') statusCode = 403;
        res.status(statusCode).json({ status: 'error', message: errorMessage || error.message });
    }
  }
}

module.exports = new EquipoController();