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
const usuarioController = require('../controllers/usuarioController');

router.post('/register', (req, res) => usuarioController.register(req, res));
// el login es post, debido a que usar GET los datos viajarian por la URL. Los datos ocultos irian en body
router.post('/login', (req, res) => usuarioController.login(req, res));
router.get('/me', (req, res) => usuarioController.me(req, res)); // esto deberia ser protegido, es decir requerir token (no implementado todavia)-Obtener datos del usuario autenticado (requiere token)

module.exports = router;
