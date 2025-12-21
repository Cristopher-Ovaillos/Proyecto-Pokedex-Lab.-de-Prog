const express = require('express');
const router = express.Router();
const equipoController = require('../controllers//equipoController');

// gestion de peticiones
router.post('/equipos',(req,res)=>equipoController.create(req,res));

module.exports = router;