const usuarioService = require("../services/usuarioService");
const handleRequest = require("../shared/handleRequest");

class UsuarioController {
  register = handleRequest(async (req, res) => {
    //req body tiene los datos del usuario a registrar
    const { nombre_usuario, email, contrasenia } = req.body;
    // estos nombres deben coincidir con los que envia el cliente

    const response = await usuarioService.register({
      nombre_usuario,
      email,
      contrasenia,
    });
    res.status(200).json(response);
  });

  login = handleRequest(async (req, res) => {
    const { nombre_usuario, contrasenia } = req.body;
    // el uso de {} es para crear un objeto con las propiedades nombre_usuario y contrasenia
    // si bien podria pasar los parametros directamente, es mejor usar un objeto para mayor claridad
    // y para facilitar la extensibilidad en el futuro si se agregan mas parametros
    const response = await usuarioService.login({
      nombre_usuario,
      contrasenia,
    });
    res.status(200).json(response);
  });

  me = handleRequest(async (req, res) => {
    // req.user vendria de un middleware de autenticacion
    if (!req.user) return res.status(401).json({ error: "No autorizado" });
    //el me devuelve los datos del usuario autenticado
    res.json(req.user);
    // el me es un ejemplo de endpoint protegido que devuelve los datos del usuario logueado
  });

  async updateUsername(req, res) {
    try {
      const { nombre_usuario } = req.body;
      const { id_usuario } = req.user;

      const result = await usuarioService.updateUsername(
        id_usuario,
        nombre_usuario,
      );

      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  updateEmail = handleRequest(async (req, res) => {
    const { email } = req.body;
    const userId = req.user.id_usuario;

    const response = await usuarioService.updateEmail(userId, email);
    res.json(response);
  });

  updatePassword = handleRequest(async (req, res) => {
    const { contraseniaNueva } = req.body;

    //completar
  });
}

module.exports = new UsuarioController();