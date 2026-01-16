const usuarioService = require('../services/usuarioService');

class UsuarioController {
    async register(req, res) {
        try {
            const result = await usuarioService.register(req.body);
            res.status(201).json({ status: 'success', ...result });
        } catch (error) {
            const [errorType, errorMessage] = error.message.split(': ');
            let statusCode = 500;
            if (errorType === 'VALIDATION_ERROR') statusCode = 400;
            if (errorType === 'CONFLICT_ERROR') statusCode = 409;
            res.status(statusCode).json({ status: 'error', message: errorMessage || error.message });
        }
    }

    async login(req, res) {
        try {
            const result = await usuarioService.login(req.body);
            res.status(200).json({ status: 'success', ...result });
        } catch (error) {
            const [errorType, errorMessage] = error.message.split(': ');
            let statusCode = 500;
            if (errorType === 'AUTH_ERROR') statusCode = 401;
            res.status(statusCode).json({ status: 'error', message: errorMessage || error.message });
        }
    }

    async me(req, res) {
        try {
            if (!req.user) {
                return res.status(403).json({ status: 'error', message: 'No autorizado. Se requiere token.' });
            }
            res.status(200).json({ status: 'success', data: req.user, message: 'Datos del usuario recuperados exitosamente' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }
    }
}

module.exports = new UsuarioController();
