const usuarioRepository = require('../repositories/usuarioRepository');
//En service utilizare en el futuro, una lib para hashear la contrasenia
//desempaqueto
// Siempre relanza(thow) el error para que el controlador lo capture
class UsuarioService {

    async register(data) {
        try {
            const nombre_usuario = data.nombre_usuario.trim();
            const email = data.email.trim();
            const contrasenia = data.contrasenia;
            if (!nombre_usuario) {
                throw new Error("VALIDATION_ERROR: El nombre de usuario debe tener al menos 8 caracteres");
            }

            if (!email || !email.includes('@')) {
                throw new Error("VALIDATION_ERROR: Email no valido");
            }

            if (!contrasenia || contrasenia.length < 8) {
                throw new Error("VALIDATION_ERROR: La contraseña es demasiado corta");
            }
            //
            const existe = await usuarioRepository.findByUsername(nombre_usuario);
            if (existe) {
                throw new Error("CONFLICT_ERROR: El nombre de usuario ya está registrado");
            }

            //
            const usuario = await usuarioRepository.create({ nombre_usuario, contrasenia, email });

            if (!usuario) return null;

            // no devolver contrasenia data:{contrasenia: usuario.contrasenia,}
            return {
                success: true,
                message: "Usuario creado exitosamente",
                data: {
                    id_usuario: usuario.id_usuario,
                    nombre_usuario: usuario.nombre_usuario,
                    email: usuario.email,
                    fecha_creacion: usuario.fecha_creacion
                }
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

            if (contrasenia !== usuario.contrasenia) {
                throw new Error("Contraseña incorrecta");
            }

            return {
                success: true,
                message: "Login exitoso",
                data: {
                    id_usuario: usuario.id_usuario,
                    nombre_usuario: usuario.nombre_usuario,
                    email: usuario.email
                }
            };

        } catch (error) {
            console.error(`[Login Error]: ${error.message}`);
            throw error; // Siempre relanza el error para que el controlador lo capture
        }

    }

}

module.exports = new UsuarioService();
