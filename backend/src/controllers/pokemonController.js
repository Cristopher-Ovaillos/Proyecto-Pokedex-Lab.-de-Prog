const pokemonService = require('../services/pokemonService');

class PokemonController {
    // req.query: Se usa para parametros despuess del signo ? (ej: /pokemon?id=25)
    async getList(req, res) {
        try {
            // req.query contiene ?page=2&limit=10&type=fire
            const response = await pokemonService.getPokedexList(req.query);
            res.status(200).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error procesando la Pokedex" });
        }
    }

    async getOne(req, res){
        try {
            //req.params: Se usa para parametros incrustados en la URL que definiste con :
            const response = await pokemonService.getPokemon(req.params);
             res.status(200).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error procesando id pokemon" });
        }

    }
}
module.exports = new PokemonController();