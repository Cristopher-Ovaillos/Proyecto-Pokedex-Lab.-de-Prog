const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const auth = require('../shared/authMiddleware');

router.post('/register', usuarioController.register);
router.post('/login', usuarioController.login);
router.get('/me', auth, usuarioController.me); 

module.exports = router;