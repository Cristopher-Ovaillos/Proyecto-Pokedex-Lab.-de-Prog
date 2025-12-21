const equipoService = require('../services/equipoService');

class EquipoController {

    async create(req, res) {
        try {
            const response = await equipoService.createTeam(req.body);
            res.status(200).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error procesando post Team" });
        }

    }


}

module.exports = new EquipoController();