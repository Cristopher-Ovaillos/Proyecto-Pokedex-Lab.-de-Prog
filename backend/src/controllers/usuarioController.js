const usuarioService = require('../serviceS/usuarioService');

class UsuarioController {

    async register(req, res) {
        try {
            const response = await usuarioService.register(req.body);
            res.status(200).json(response);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async login(req, res) {
        try {
            const user = await usuarioService.login(req.body);
            res.json({ message: "Login exitoso", user });
        } catch (err) {
            res.status(401).json({ error: err.message });
        }
    }

    async me(req, res) {
        // req.user vendría de un middleware de autenticación
        if (!req.user) return res.status(401).json({ error: "No autorizado" });
        res.json(req.user);
    }

}

module.exports = new UsuarioController();