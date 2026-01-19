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
//authMiddleware 
const auth = require('../shared/authMiddleware');

router.post('/register', (req, res) => usuarioController.register(req, res));
// el login es post, debido a que usar GET los datos viajarian por la URL. Los datos ocultos irian en body
router.post('/login', (req, res) => usuarioController.login(req, res));
router.get('/protected', auth, (req, res) => usuarioController.me(req, res)); // esto deberia ser protegido, es decir requerir token (no implementado todavia)-Obtener datos del usuario autenticado (requiere token)
//router.get tiene  el endpoint /me, usa el middleware auth para verificar token, y llama a usuarioController.me
//el get verifica auth si el token es valido, y si lo es llama a usuarioController.me

//para cerrar sesion, en el cliente se borra el token guardado localmente. No es necesario un endpoint en el servidor para logout en JWT
// porque el servidor no mantiene estado de sesion. El token simplemente expira despues de un tiempo definido.

//updates de perfil: solo se puede modificar teniendo el token, por lo tanto es neceario el auth
router.put('/username', auth, (req, res) => usuarioController.updateUsername(req, res));

router.put('/email', auth, (req, res) => usuarioController.updateEmail(req, res));

router.put('/password', auth, (req, res) => usuarioController.updatePassword(req, res));



module.exports = router;

//bruno api
// ejemplo de /me
// GET /me
// Headers:
// Authorization: Bearer <token_jwt_aqui>
//
// Respuesta exitosa (200 OK):
// {
//   "id": 1,
//   "nombre": "Cristopher",
//   "email": "cristopher@example.com"
// }

//devuelve {
// "id_usuario": 1,
//   "nombre_usuario": "usuario",
//   "iat": 1767367993,
//   "exp": 1767371593
// }
// significa issued at (emitido en) y expiration (expiracion) en segundos desde epoch time (1970)