//objetivo: manejar los endpoiunt de solo lectura
/* 
comentarios:
en repotory.js es el que configura la base de datos, si cambia la base de datos solo es necesario aca mismo.
En repositry.js  hacemos las queries sql.

service: por ej. se calcularia las stat, siempre llamara a repository. El servicio no le importa de donde vienen los datos, soloq ue repositorie se lo entregue.

las query params, es el usuario quien filtra resutlados en la URL.
Express toma todo lo que esta despues de  ?  y lo parsea en un obj llamado req.query
Express realiza un parseo de string (split por & y =). 

*/


const express = require('express');
const router = express.Router();
const pokemonController = require('../controllers/pokemonController');

// gestion de peticiones
router.get('/', (req, res) => pokemonController.getList(req, res));
router.get('/:id', (req, res) => pokemonController.getOne(req, res));

module.exports = router;