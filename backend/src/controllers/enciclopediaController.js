const enciclopediaService = require('../services/enciclopediaService');

function getHttpStatus(errorMessage) {
    if (errorMessage.includes('VALIDATION_ERROR')) return 400;
    if (errorMessage.includes('NOT_FOUND_ERROR')) return 404;
    if (errorMessage.includes('CONFLICT_ERROR')) return 409;
    if (errorMessage.includes('AUTH_ERROR')) return 401;
    return 500;
}


class EnciclopediaController {
    
    async listPokemon(req, res) {
        try {
            const type = req.query.type;
            const search = req.query.search;
            const limit = req.query.limit;
            const page = req.query.page;
            const min_hp = req.query.min_hp;
            const max_hp = req.query.max_hp;
            const sort = req.query.sort;
            const order = req.query.order;
            
            const result = await enciclopediaService.getPokemonList(type, search, limit, page, min_hp, max_hp, sort, order);
            res.status(200).json(result);
        } catch (error) {
            const status = getHttpStatus(error.message);
            res.status(status).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    async getPokemonById(req, res) {
        try {
            const id = req.params.id;
            const result = await enciclopediaService.getPokemonById(id);
            res.status(200).json(result);
        } catch (error) {
            const status = getHttpStatus(error.message);
            res.status(status).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    async getPokemonMoves(req, res) {
        try {
            const id = req.params.id;
            const level = req.query.level;
            const method = req.query.method;
            const type = req.query.type;
            const category = req.query.category;
            const min_power = req.query.min_power;
            const max_power = req.query.max_power;
            
            const result = await enciclopediaService.getPokemonMoves(id, level, method, type, category, min_power, max_power);
            res.status(200).json(result);
        } catch (error) {
            const status = getHttpStatus(error.message);
            res.status(status).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    async listMoves(req, res) {
        try {
            const type = req.query.type;
            const category = req.query.category;
            const min_power = req.query.min_power;
            const max_power = req.query.max_power;
            const min_accuracy = req.query.min_accuracy;
            const max_accuracy = req.query.max_accuracy;
            const search = req.query.search;
            const limit = req.query.limit;
            const page = req.query.page;
            
            const result = await enciclopediaService.getMovesList(type, category, min_power, max_power, min_accuracy, max_accuracy, search, limit, page);
            res.status(200).json(result);
        } catch (error) {
            const status = getHttpStatus(error.message);
            res.status(status).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    async listNatures(req, res) {
        try {
            const result = await enciclopediaService.getNaturesList();
            res.status(200).json(result);
        } catch (error) {
            const status = getHttpStatus(error.message);
            res.status(status).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    async listAbilities(req, res) {
        try {
            const search = req.query.search;
            const limit = req.query.limit;
            const page = req.query.page;
            
            const result = await enciclopediaService.getAbilitiesList(search, limit, page);
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

module.exports = new EnciclopediaController();