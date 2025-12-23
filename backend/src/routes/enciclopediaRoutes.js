const express = require('express');
const router = express.Router();
const enciclopediaController = require('../controllers/enciclopediaController');

router.get('/pokemon', enciclopediaController.listPokemon);
router.get('/pokemon/:id', enciclopediaController.getPokemonById);
router.get('/pokemon/:id/movimientos', enciclopediaController.getPokemonMoves);
router.get('/movimientos', enciclopediaController.listMoves);
router.get('/naturalezas', enciclopediaController.listNatures);
router.get('/habilidades', enciclopediaController.listAbilities);

module.exports = router;