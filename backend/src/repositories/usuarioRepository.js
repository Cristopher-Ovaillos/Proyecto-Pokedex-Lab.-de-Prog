const db = require("../shared/db");
//sqlite https://github.com/TryGhost/node-sqlite3/wiki/API, debependiendo del motor cambia, en este caso es db.accion

/*
En repository recibimos los atributos a usar
{atributo1,atributo2}
Realizar operaciones async

op db sqlite
- db.run()
    - se usa para op. que no esperan recibir datos de vuelta salgo confirmacion.
    - operación que modifique datos (como INSERT (usar this.LastID), UPDATE (podemos usar this.changes para ver cuantas filas se editaron), DELETE)
- db get
    - lectura de un solo registro
    - para: login, detalle (soo devuleve el primer resultado)
- db.all 
    - se usa para lectura de mutiplkes registros
    - array de obj.
- db .each
    - se usa para procesar filas una por una.
    - callback se ejecuta una vez por cada fila.

convecion nombres:
- create(data)
- findAll() o getAll()
- findById(id)
- findOne(params)
- update(id, data)
- delete(id)

* en repository: Loguearse, no se hace directamente. La verificacion de la contrasenia no se maneja aca si no que devolvemos el obj que buscamos con el username.

*/

class UsuarioRepository {
  //crear user
  async create({ nombre_usuario, contrasenia, email }) {
    //crear promesa (uso de async)
    return new Promise((resolve, reject) => {
      const fecha_creacion = new Date().toISOString();
      // atributos rellenables con el simbolo?
      const sql =
        "INSERT INTO usuarios(nombre_usuario, contrasenia, fecha_creacion, email) VALUES (?,?,?,?)";

      db.run(
        sql,
        [nombre_usuario, contrasenia, fecha_creacion, email],
        function (err) {
          //si falla
          if (err) return reject(err);
          //si no falla resolve({devolver}) esto devolveremos como promesa (resolve)
          resolve({
            id_usuario: this.lastID,
            nombre_usuario,
            contrasenia,
            fecha_creacion,
            email,
          });
        }
      );
    });
  }

  //loguearse
  async findByUsername(nombre_usuario) {
    // vamos a devolver la contrania aca
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM usuarios WHERE nombre_usuario = ?";

      db.get(sql, [nombre_usuario], function (err, tupla) {
        if (err) return reject(err);
        resolve(tupla);
      });
    });
  }

  async findById(id_usuario) {
    return new Promise((resolve, reject) => {
      const sql =
        "SELECT id_usuario, nombre_usuario, email, fecha_creacion FROM usuarios WHERE id_usuario = ?";
      this.db.get(sql, [id_usuario], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  async findByEmail(email) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM usuarios WHERE email = ?";
      db.get(sql, [email], function (err, tupla) {
        if (err) return reject(err);
        resolve(tupla);
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
