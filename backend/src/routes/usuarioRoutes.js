const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const auth = require('../shared/authMiddleware');

router.post('/register', usuarioController.register);
router.post('/login', usuarioController.login);
router.get('/me', auth, usuarioController.me); 
//updates de perfil: solo se puede modificar teniendo el token, por lo tanto es neceario el auth
router.put('/username', auth, (req, res) => usuarioController.updateUsername(req, res));

router.put('/email', auth, (req, res) => usuarioController.updateEmail(req, res));

router.put('/password', auth, (req, res) => usuarioController.updatePassword(req, res));

module.exports = router;