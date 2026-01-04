
const equiposService = require('../services/equipoService');
const handleRequest = require('../shared/handleRequest');
const getHttpStatus = require('../shared/getHttpStatus');


class EquiposController {
  listarEquiposUsuario = handleRequest(async (req, res) => {
    const idUsuarioUrl = req.params.id_usuario;
    // nota: cuando se haya hecho la parte de  autenticacion, aqui se obtienes el usuario logueado
    // const usuarioLogueadoId = req.user.id; // desde middleware de autenticacion
    const usuarioLogueadoId = 1; 
    const result = await equiposService.getEquiposByUsuario(idUsuarioUrl, usuarioLogueadoId);
    res.status(200).json(result);
  }, getHttpStatus);

  crearEquipo = handleRequest(async (req, res) => {
    const equipoData = {
      nombre: req.body.nombre,
      // con  autenticacion, el id_usuario viene del token, no del body
      // id_usuario: req.user.id
      id_usuario: req.body.id_usuario  // temp
    };
    const result = await equiposService.crearEquipo(equipoData);
    res.status(201).json(result);
  }, getHttpStatus);

  obtenerEquipo = handleRequest(async (req, res) => {
    const equipoId = req.params.id;
    // cuando tengas autenticacion, valida que el usuario pueda ver este equipo
    // const usuarioLogueadoId = req.user.id;
    const usuarioLogueadoId = 1; // temporal
    const result = await equiposService.getEquipoById(equipoId, usuarioLogueadoId);
    res.status(200).json(result);
  }, getHttpStatus);

  actualizarEquipo = handleRequest(async (req, res) => {
    const equipoId = req.params.id;
    const datosActualizacion = {
      nombre: req.body.nombre,
      integrantes: req.body.integrantes // array de pokemon con sus datos
    };
    // cuando tengas autenticacion:
    // const usuarioLogueadoId = req.user.id;
    const usuarioLogueadoId = 1; // temporal
    const result = await equiposService.actualizarEquipo(equipoId, datosActualizacion, usuarioLogueadoId);
    res.status(200).json(result);
  }, getHttpStatus);

  eliminarEquipo = handleRequest(async (req, res) => {
    const equipoId = req.params.id;
    // cuando tengas autenticacion:
    // const usuarioLogueadoId = req.user.id;
    const usuarioLogueadoId = 1; // temporal
    const result = await equiposService.eliminarEquipo(equipoId, usuarioLogueadoId);
    res.status(200).json(result);
  }, getHttpStatus);
}

module.exports = new EquiposController();