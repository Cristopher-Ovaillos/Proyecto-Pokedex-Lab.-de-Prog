const express = require('express');
const router = express.Router();
const enciclopediaController = require('../controllers/enciclopediaController');

// Enciclopedia - Rutas públicas (solo lectura)

// Lista Pokémon con filtros (ej: ?type=fire&search=pika&limit=20)
router.get('/pokemon', (req, res) => enciclopediaController.listPokemon(req, res));

// Obtiene un Pokémon específico por ID (incluye stats base, tipos y habilidades)
router.get('/pokemon/:id', (req, res) => enciclopediaController.getPokemonById(req, res));

// Lista los movimientos que un Pokémon puede aprender (con filtros opcionales)
router.get('/pokemon/:id/movimientos', (req, res) => enciclopediaController.getPokemonMoves(req, res));

// Lista general de movimientos con filtros
router.get('/movimientos', (req, res) => enciclopediaController.listMoves(req, res));

// Lista todas las naturalezas y sus modificadores (+/-)
router.get('/naturalezas', (req, res) => enciclopediaController.listNatures(req, res));

// Diccionario general de habilidades
router.get('/habilidades', (req, res) => enciclopediaController.listAbilities(req, res));

module.exports = router;