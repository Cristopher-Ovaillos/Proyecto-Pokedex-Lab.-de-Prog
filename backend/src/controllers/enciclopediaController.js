const enciclopediaService = require('../services/enciclopediaService');
const handleRequest = require('../shared/handleRequest');
const getHttpStatus = require('../shared/getHttpStatus');


class EnciclopediaController {

  listarPokemons = handleRequest(async (req, res) => {
    const result = await enciclopediaService.listarPokemons(req.query);
    res.status(200).json({ status: 'success', ...result });
  });

  obtenerPokemonPorId = handleRequest(async (req, res) => {
    const result = await enciclopediaService.obtenerPokemonPorId(req.params.id);
    res.status(200).json({ status: 'success', ...result });
  });

  obtenerMovimientosDePokemon = handleRequest(async (req, res) => {
    const result = await enciclopediaService.obtenerMovimientosDePokemon(req.params.id, req.query);
    res.status(200).json({ status: 'success', ...result });
  });

  listarMovimientos = handleRequest(async (req, res) => {
    const result = await enciclopediaService.listarMovimientos(req.query);
    res.status(200).json({ status: 'success', ...result });
  });

  getMoveById = handleRequest(async (req, res) => {
    const result = await enciclopediaService.obtenerMovimientoPorId(req.params.id);
    res.status(200).json({ status: 'success', ...result });
  });

  getPokemonsByMoveId = handleRequest(async (req, res) => {
    const result = await enciclopediaService.obtenerPokemonsPorMovimientoId(req.params.id);
    res.status(200).json({ status: 'success', ...result });
  });

  listarNaturalezas = handleRequest(async (req, res) => {
    const result = await enciclopediaService.listarNaturalezas();
    res.status(200).json({ status: 'success', ...result });
  });

  listarHabilidades = handleRequest(async (req, res) => {
    const result = await enciclopediaService.listarHabilidades(req.query);
    res.status(200).json({ status: 'success', ...result });
  });
}

module.exports = new EnciclopediaController();