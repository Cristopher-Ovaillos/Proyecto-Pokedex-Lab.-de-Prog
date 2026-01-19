const usuarioRepository = require("../repositories/usuarioRepository");
//En service utilizare en el futuro, una lib para hashear la contrasenia
//desempaqueto
// Siempre relanza(thow) el error para que el controlador lo capture
const bcrypt = require("bcrypt");
const { SALT_ROUNDS, JWT_SECRET } = require("../shared/config");
//login
const jwt = require("jsonwebtoken");
class UsuarioService {
  async register(data) {
    try {
      const nombre_usuario = data.nombre_usuario.trim();
      const email = data.email.trim();
      const contrasenia = data.contrasenia;
      if (!nombre_usuario) {
        throw new Error(
          "VALIDATION_ERROR: El nombre de usuario debe tener al menos 8 caracteres",
        );
      }

      if (!email || !email.includes("@")) {
        throw new Error("VALIDATION_ERROR: Email no valido");
      }

      if (!contrasenia || contrasenia.length < 8) {
        throw new Error("VALIDATION_ERROR: La contraseña es demasiado corta");
      }

      const existe = await usuarioRepository.findByUsername(nombre_usuario);
      if (existe) {
        throw new Error(
          "CONFLICT_ERROR: El nombre de usuario ya esta registrado",
        );
      }
      //BSCRYPT
      const contrasenia_hash = await bcrypt.hash(contrasenia, SALT_ROUNDS);
      //
      const usuario = await usuarioRepository.create({
        nombre_usuario,
        contrasenia: contrasenia_hash,
        email,
      });

      if (!usuario) return null;

      // no devolver contrasenia data:{contrasenia: usuario.contrasenia,}
      return {
        success: true,
        message: "Usuario creado exitosamente",
        data: {
          id_usuario: usuario.id_usuario,
          nombre_usuario: usuario.nombre_usuario,
          email: usuario.email,
          fecha_creacion: usuario.fecha_creacion,
          contrasenia: usuario.contrasenia,
        },
      };
    } catch (error) {
      console.error(`[UsuarioService Error]: ${error.message}`);
      throw error;
    }
  }

  async login(data) {
    try {
      const nombre_usuario = data.nombre_usuario.trim();
      const contrasenia = data.contrasenia;

      const usuario = await usuarioRepository.findByUsername(nombre_usuario);
      if (!usuario) {
        throw new Error("AUTH_ERROR: Usuario no encontrado");
      }
      //se hashea la contrasenia y se compara, no se deshashea...ademas la contrasenia del usuario tiene dato para hashear.
      const contraseniaMatch = await bcrypt.compare(
        contrasenia,
        usuario.contrasenia,
      );

      if (contraseniaMatch === false) {
        throw new Error("Contraseña incorrecta");
      }

      const tokenPayload = {
        id_usuario: usuario.id_usuario,
        nombre_usuario: usuario.nombre_usuario,
      };
      // generar token JWT con duracion de 2 horas, parametros: payload, secret, opciones
      // paylos es la info que queremos guardar en el token
      // secret es una cadena secreta para firmar el token
      // opciones puede incluir expiracion, algoritmo, etc
      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1h" });

      return {
        success: true,
        token: token,
        message: "Login exitoso",
        data: {
          id_usuario: usuario.id_usuario,
          nombre_usuario: usuario.nombre_usuario,
          email: usuario.email,
        },
      };
    } catch (error) {
      console.error(`[Login Error]: ${error.message}`);
      throw error; // Siempre relanza el error para que el controlador lo capture
    }
  }

  async updateUsername(id_usuario, nombre_usuario) {
    try {
      const nuevoNombre = nombre_usuario.trim();

      if (!nuevoNombre || nuevoNombre.length < 3) {
        throw new Error("Nombre inválido");
      }

      const existe = await usuarioRepository.findByUsername(nuevoNombre);
      if (existe) {
        throw new Error("El nombre de usuario ya existe");
      }

      const cambios = await usuarioRepository.updateUsername(
        id_usuario,
        nuevoNombre,
      );

      if (cambios === 0) {
        throw new Error("Usuario no encontrado");
      }

      return {
        success: true,
        message: "Nombre de usuario actualizado",
      };
    } catch (error) {
      console.error(`[UsuarioService updateUsername]: ${error.message}`);
      throw error;
    }
  }

  async updateEmail(id_usuario, email) {
    try {
      const nuevoEmail = email.trim();

      if (!nuevoEmail || !nuevoEmail.includes("@")) {
        throw new Error("Email inválido");
      }

      const existe = await usuarioRepository.findByEmail(nuevoEmail);
      if (existe) {
        throw new Error("El email ya está registrado");
      }

      const cambios = await usuarioRepository.updateEmail(
        id_usuario,
        nuevoEmail,
      );

      if (cambios === 0) {
        throw new Error("Usuario no encontrado");
      }

      return {
        success: true,
        message: "Email actualizado",
      };
    } catch (error) {
      console.error(`[UsuarioService updateEmail]: ${error.message}`);
      throw error;
    }
  }

  async updatePassword(id_usuario, contraseniaActual, contraseniaNueva) {
    //completar
  }
}

module.exports = new UsuarioService();
