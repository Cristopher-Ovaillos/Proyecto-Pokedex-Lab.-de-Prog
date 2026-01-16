const enciclopediaService = require('../services/enciclopediaService');

class EnciclopediaController {

  async listarPokemons(req, res) {
    try {
      const result = await enciclopediaService.listarPokemons(req.query);
      res.status(200).json({ status: 'success', ...result });
    } catch (error) {
      const [errorType, errorMessage] = error.message.split(': ');
      let statusCode = 500;
      if (errorType === 'VALIDATION_ERROR') statusCode = 400;
      res.status(statusCode).json({ status: 'error', message: errorMessage || error.message });
    }
  }

  async obtenerPokemonPorId(req, res) {
    try {
      const result = await enciclopediaService.obtenerPokemonPorId(req.params.id);
      res.status(200).json({ status: 'success', ...result });
    } catch (error) {
      const [errorType, errorMessage] = error.message.split(': ');
      let statusCode = 500;
      if (errorType === 'NOT_FOUND_ERROR') statusCode = 404;
      res.status(statusCode).json({ status: 'error', message: errorMessage || error.message });
    }
  }

  async obtenerMovimientosDePokemon(req, res) {
    try {
      const result = await enciclopediaService.obtenerMovimientosDePokemon(req.params.id, req.query);
      res.status(200).json({ status: 'success', ...result });
    } catch (error) {
      const [errorType, errorMessage] = error.message.split(': ');
      let statusCode = 500;
      if (errorType === 'VALIDATION_ERROR') statusCode = 400;
      if (errorType === 'NOT_FOUND_ERROR') statusCode = 404;
      res.status(statusCode).json({ status: 'error', message: errorMessage || error.message });
    }
  }

  async listarMovimientos(req, res) {
    try {
      const result = await enciclopediaService.listarMovimientos(req.query);
      res.status(200).json({ status: 'success', ...result });
    } catch (error) {
      const [errorType, errorMessage] = error.message.split(': ');
      let statusCode = 500;
      if (errorType === 'VALIDATION_ERROR') statusCode = 400;
      res.status(statusCode).json({ status: 'error', message: errorMessage || error.message });
    }
  }

  async listarNaturalezas(req, res) {
    try {
      const result = await enciclopediaService.listarNaturalezas();
      res.status(200).json({ status: 'success', ...result });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async listarHabilidades(req, res) {
    try {
      const result = await enciclopediaService.listarHabilidades(req.query);
      res.status(200).json({ status: 'success', ...result });
    } catch (error) {
      const [errorType, errorMessage] = error.message.split(': ');
      let statusCode = 500;
      if (errorType === 'VALIDATION_ERROR') statusCode = 400;
      res.status(statusCode).json({ status: 'error', message: errorMessage || error.message });
    }
  }
}

module.exports = new EnciclopediaController();