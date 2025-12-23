const express = require('express');
const router = express.Router();
const equiposController = require('../controllers/equiposController');

// sin middleware por ahora - pero aqui iria la autenticacion
// ejemplo: router.use(authMiddleware);

router.get('/usuarios/:id_usuario/equipos', equiposController.listarEquiposUsuario);
router.post('/equipos', equiposController.crearEquipo);
router.get('/equipos/:id', equiposController.obtenerEquipo);
router.put('/equipos/:id', equiposController.actualizarEquipo);
router.delete('/equipos/:id', equiposController.eliminarEquipo);

module.exports = router;