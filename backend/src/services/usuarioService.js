const usuarioRepository = require('../repositories/usuarioRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SALT_ROUNDS, JWT_SECRET } = require('../shared/config');

function validar(condicion, mensaje) {
    if (condicion) {
        throw new Error(`VALIDATION_ERROR: ${mensaje}`);
    }
}

class UsuarioService {

    async register(data) {
        try {
            const { nombre_usuario, email, contrasenia } = data;
            
            validar(!nombre_usuario || nombre_usuario.trim().length < 3, "El nombre de usuario debe tener al menos 3 caracteres");
            validar(!email || !email.includes('@'), "Email no válido");
            validar(!contrasenia || contrasenia.length < 8, "La contraseña es demasiado corta (mínimo 8 caracteres)");
           
            const existeUsuario = await usuarioRepository.buscarPorNombreUsuario(nombre_usuario.trim());
            if (existeUsuario) {
                throw new Error("CONFLICT_ERROR: El nombre de usuario ya está registrado");
            }
            
            const existeEmail = await usuarioRepository.buscarPorEmail(email.trim());
            if (existeEmail) {
                throw new Error("CONFLICT_ERROR: El email ya está registrado");
            }

            const contrasenia_hash = await bcrypt.hash(contrasenia, SALT_ROUNDS);
            
            const usuario = await usuarioRepository.crear({ 
                nombre_usuario: nombre_usuario.trim(), 
                contrasenia: contrasenia_hash, 
                email: email.trim() 
            });

            return {
                message: "Usuario creado exitosamente",
                data: {
                    id_usuario: usuario.id_usuario,
                    nombre_usuario: usuario.nombre_usuario,
                    email: usuario.email,
                    fecha_creacion: usuario.fecha_creacion,
                }
            };

        } catch (error) {
            console.error(`[UsuarioService Error]: ${error.message}`);
            throw error;
        }
    }

    async login(data) {
        try {
      
            const { nombre_usuario, contrasenia } = data;
            validar(!nombre_usuario || !contrasenia, "Nombre de usuario y contraseña son requeridos");
      
            const usuario = await usuarioRepository.buscarPorNombreUsuario(nombre_usuario.trim());
            if (!usuario) {
                throw new Error("AUTH_ERROR: Credenciales inválidas");
            }
      
            const contraseniaMatch = await bcrypt.compare(contrasenia, usuario.contrasenia);
            if (!contraseniaMatch) {
                throw new Error("AUTH_ERROR: Credenciales inválidas");
            }
           
            const tokenPayload = {
                id_usuario: usuario.id_usuario,
                nombre_usuario: usuario.nombre_usuario
            };
            
            const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '2h' });  

            return {
                token: token,
                message: "Login exitoso",
                data: {
                    id_usuario: usuario.id_usuario,
                    nombre_usuario: usuario.nombre_usuario,
                    email: usuario.email,
                    fecha_creacion: usuario.fecha_creacion,
                }
            };

        } catch (error) {
            console.error(`[Login Error]: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new UsuarioService();
