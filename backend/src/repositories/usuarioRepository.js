const db = require('../shared/db');

class UsuarioRepository {

    async crear({ nombre_usuario, contrasenia, email }) {
        return new Promise((resolve, reject) => {
            const fecha_creacion = new Date().toISOString();
            const sql = "INSERT INTO usuarios(nombre_usuario, contrasenia, fecha_creacion,email) VALUES (?,?,?,?)";

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

      async updateUsername(id_usuario, nombre_usuario) {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE usuarios SET nombre_usuario = ? WHERE id_usuario = ?";
      db.run(sql, [nombre_usuario, id_usuario], function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  }

  async updateEmail(id_usuario, email) {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE usuarios SET email = ? WHERE id_usuario = ?";
      db.run(sql, [email, id_usuario], function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  }

  async updatePassword(id_usuario, contraseniaHash) {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE usuarios SET contrasenia = ? WHERE id_usuario = ?";
      db.run(sql, [contraseniaHash, id_usuario], function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  }

}

module.exports = new UsuarioRepository();