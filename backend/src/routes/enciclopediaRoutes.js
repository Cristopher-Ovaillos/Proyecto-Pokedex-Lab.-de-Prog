const express = require('express');
const router = express.Router();
const enciclopediaController = require('../controllers/enciclopediaController');
//const authMiddleware = require('../shared/authMiddleware');

//router.get('/pokemon', authMiddleware,enciclopediaController.listarPokemons);
//router.get('/pokemon/:id', authMiddleware,enciclopediaController.obtenerPokemonPorId);
//router.get('/pokemon/:id/movimientos', authMiddleware,enciclopediaController.obtenerMovimientosDePokemon);

///api/enciclopedia prefijo
router.get('/pokemon', enciclopediaController.listarPokemons);
router.get('/pokemon/:id', enciclopediaController.obtenerPokemonPorId);
router.get('/pokemon/:id/movimientos', enciclopediaController.obtenerMovimientosDePokemon);

router.get('/movimientos', enciclopediaController.listarMovimientos);
router.get('/naturalezas', enciclopediaController.listarNaturalezas);
router.get('/habilidades', enciclopediaController.listarHabilidades);

module.exports = router;
