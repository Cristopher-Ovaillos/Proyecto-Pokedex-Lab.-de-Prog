
const enciclopediaService = require('../services/enciclopediaService');
const handleRequest = require('../shared/handleRequest');
const getHttpStatus = require('../shared/getHttpStatus');


class EnciclopediaController {
  listPokemon = handleRequest(async (req, res) => {
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
  }, getHttpStatus);

  getPokemonById = handleRequest(async (req, res) => {
    const id = req.params.id;
    const result = await enciclopediaService.getPokemonById(id);
    res.status(200).json(result);
  }, getHttpStatus);

  getPokemonMoves = handleRequest(async (req, res) => {
    console.log("Llegue al controller");
    const id = req.params.id;
    const level = req.query.level;
    const method = req.query.method;
    const type = req.query.type;
    const category = req.query.category;
    const min_power = req.query.min_power;
    const max_power = req.query.max_power;
    const result = await enciclopediaService.getPokemonMoves(id, level, method, type, category, min_power, max_power);
    console.log("controler result: ",result);
    res.status(200).json(result);
  }, getHttpStatus);

  listMoves = handleRequest(async (req, res) => {
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
  }, getHttpStatus);

  listNatures = handleRequest(async (req, res) => {
    const result = await enciclopediaService.getNaturesList();
    res.status(200).json(result);
  }, getHttpStatus);

  listAbilities = handleRequest(async (req, res) => {
    const search = req.query.search;
    const limit = req.query.limit;
    const page = req.query.page;
    const result = await enciclopediaService.getAbilitiesList(search, limit, page);
    res.status(200).json(result);
  }, getHttpStatus);
}

module.exports = new EnciclopediaController();