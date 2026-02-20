const express = require('express');
const router = express.Router();
const equipoController = require('../controllers/equipoController');
const auth = require('../shared/authMiddleware');

router.use(auth);

router.get('/usuarios/:id_usuario/equipos', equipoController.listarDeUsuario);
router.post('/equipos', equipoController.crear);
router.get('/equipos/:id', equipoController.obtenerPorId);
router.put('/equipos/:id', equipoController.actualizar);
router.delete('/equipos/:id', equipoController.eliminar);

// Rutas para modificaciones granulares
router.patch('/equipos/:id/pokemon/:pokemon_equipo_id', equipoController.actualizarPokemonDeEquipo);
router.post('/equipos/:id/pokemon/:pokemon_equipo_id/movimientos', equipoController.agregarMovimientoAEquipoPokemon);
router.delete('/equipos/:id/pokemon/:pokemon_equipo_id/movimientos/:slot', equipoController.eliminarMovimientoDeEquipoPokemon);


module.exports = router;