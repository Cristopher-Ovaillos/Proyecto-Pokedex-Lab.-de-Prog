const enciclopediaService = require('../services/enciclopediaService');

class EnciclopediaController {
    
    // 1. Listar Pokémon
    async listPokemon(req, res) {
        try {
            const filters = req.query;
            const result = await enciclopediaService.getPokemonList(filters);
            res.status(200).json(result);
        } catch (error) {
            const status = this.getHttpStatus(error.message);
            res.status(status).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // 2. Obtener Pokémon por ID
    async getPokemonById(req, res) {
        try {
            const { id } = req.params;
            const result = await enciclopediaService.getPokemonById(id);
            res.status(200).json(result);
        } catch (error) {
            const status = this.getHttpStatus(error.message);
            res.status(status).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // 3. Obtener movimientos de un Pokémon
    async getPokemonMoves(req, res) {
        try {
            const { id } = req.params;
            const filters = req.query;
            const result = await enciclopediaService.getPokemonMoves(id, filters);
            res.status(200).json(result);
        } catch (error) {
            const status = this.getHttpStatus(error.message);
            res.status(status).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // 4. Listar movimientos generales
    async listMoves(req, res) {
        try {
            const filters = req.query;
            const result = await enciclopediaService.getMovesList(filters);
            res.status(200).json(result);
        } catch (error) {
            const status = this.getHttpStatus(error.message);
            res.status(status).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // 5. Listar naturalezas
    async listNatures(req, res) {
        try {
            const result = await enciclopediaService.getNaturesList();
            res.status(200).json(result);
        } catch (error) {
            const status = this.getHttpStatus(error.message);
            res.status(status).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // 6. Listar habilidades
    async listAbilities(req, res) {
        try {
            const filters = req.query;
            const result = await enciclopediaService.getAbilitiesList(filters);
            res.status(200).json(result);
        } catch (error) {
            const status = this.getHttpStatus(error.message);
            res.status(status).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // Método auxiliar para determinar código HTTP basado en mensaje de error
    getHttpStatus(errorMessage) {
        if (errorMessage.includes('VALIDATION_ERROR')) return 400;
        if (errorMessage.includes('NOT_FOUND_ERROR')) return 404;
        if (errorMessage.includes('CONFLICT_ERROR')) return 409;
        if (errorMessage.includes('AUTH_ERROR')) return 401;
        return 500;
    }
}

module.exports = new EnciclopediaController();