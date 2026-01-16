const db = require('../shared/db');

class UsuarioRepository {

    async crear({ nombre_usuario, contrasenia, email }) {
        return new Promise((resolve, reject) => {
            const fecha_creacion = new Date().toISOString();
            const sql = "INSERT INTO usuarios(nombre_usuario, contrasenia, email) VALUES (?,?,?,?)";

            db.run(sql, [nombre_usuario, contrasenia, fecha_creacion, email], function (err) {
                if (err) return reject(err);
                resolve({ id_usuario: this.lastID, nombre_usuario, email, fecha_creacion });
            });
        });
    }

    async buscarPorNombreUsuario(nombre_usuario) {
        return new Promise((resolve, reject) => {
            //
            const sql = "SELECT * FROM usuarios WHERE nombre_usuario = ?";
            db.get(sql, [nombre_usuario], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    async buscarPorId(id_usuario) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT id_usuario, nombre_usuario, email, fecha_creacion FROM usuarios WHERE id_usuario = ?";
            db.get(sql, [id_usuario], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    async buscarPorEmail(email) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM usuarios WHERE email = ?";
            db.get(sql, [email], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }
}

module.exports = new UsuarioRepository();