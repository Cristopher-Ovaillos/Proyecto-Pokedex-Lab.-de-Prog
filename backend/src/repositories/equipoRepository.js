const db = require('../shared/db');
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

* ademas para no especificar cada atirbuto como parametro se puede utilizar los iguiente (filter = {}), ese filter se rellena con lo que llega.

*/

class EquiposRepository {

    // verifica si un usuario existe
    async verificarUsuarioExiste(idUsuario) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT id_usuario FROM usuarios WHERE id_usuario = ? LIMIT 1";
            db.get(sql, [idUsuario], (err, row) => {
                if (err) return reject(err);
                resolve(!!row); // true si existe, false si no
            });
        });
    }

    // verifica si un pokemon existe
    async verificarPokemonExiste(idPokemon) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT id_pokemon FROM pokemon WHERE id_pokemon = ? LIMIT 1";
            db.get(sql, [idPokemon], (err, row) => {
                if (err) return reject(err);
                resolve(!!row);
            });
        });
    }

    // obtiene equipos de un usuario
    async findEquiposByUsuarioId(idUsuario) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM equipos WHERE id_usuario = ? ORDER BY fecha_creacion DESC";
            db.all(sql, [idUsuario], (err, rows) => {
                if (err) return reject(err);
                resolve(rows || []);
            });
        });
    }

    // crea un nuevo equipo
    async createEquipo(equipoData) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO equipos (nombre, fecha_creacion, id_usuario) VALUES (?, datetime('now'), ?)";
            
            db.run(sql, [equipoData.nombre, equipoData.id_usuario], function(err) {
                if (err) return reject(err);
                // this.lastID contiene el ID del nuevo equipo
                resolve(this.lastID);
            });
        });
    }

    // obtiene cabecera de un equipo
    async findEquipoById(equipoId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM equipos WHERE id_equipo = ? LIMIT 1";
            db.get(sql, [equipoId], (err, row) => {
                if (err) return reject(err);
                resolve(row || null);
            });
        });
    }

    // obtiene todos los pokemons de un equipo con sus detalles
    async findPokemonsByEquipoId(equipoId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    ep.id_pokemon_equipo,
                    ep.ev_hp,
                    ep.ev_ataque,
                    ep.ev_ataque_especial,
                    ep.ev_defensa,
                    ep.ev_defensa_especial,
                    ep.ev_velocidad,
                    ep.iv_hp,
                    ep.iv_ataque,
                    ep.iv_ataque_especial,
                    ep.iv_defensa,
                    ep.iv_defensa_especial,
                    ep.iv_velocidad,
                    p.id_pokemon,
                    p.nombre as pokemon_nombre,
                    p.tipo_1,
                    p.tipo_2,
                    p.hp_base,
                    p.ataque_base,
                    p.ataque_especial_base,
                    p.defensa_base,
                    p.defensa_especial_base,
                    p.velocidad_base,
                    n.nombre as naturaleza_nombre,
                    n.estadistica_mas,
                    n.estadistica_menos,
                    h.nombre as habilidad_nombre,
                    h.descripcion as habilidad_descripcion
                FROM equipo_pokemon ep
                JOIN pokemon p ON ep.id_pokemon = p.id_pokemon
                JOIN naturaleza n ON ep.id_naturaleza = n.id_naturaleza
                JOIN habilidades h ON ep.id_habilidad = h.id_habilidad
                WHERE ep.id_equipo = ?
                ORDER BY ep.id_pokemon_equipo
            `;
            
            db.all(sql, [equipoId], (err, rows) => {
                if (err) return reject(err);
                
                // si hay pokemons, obtener sus movimientos tambien
                if (rows && rows.length > 0) {
                    const promises = rows.map(pokemon => {
                        return new Promise((resolveInner, rejectInner) => {
                            const sqlMovimientos = `
                                SELECT 
                                    m.id_movimiento,
                                    m.nombre,
                                    m.tipo,
                                    m.categoria,
                                    m.poder,
                                    m.pp,
                                    m.descripcion,
                                    m.precision
                                FROM movimiento m
                                JOIN pokemon_tiene_movimento ptm ON m.id_movimiento = ptm.id_movimiento
                                WHERE ptm.id_pokemon_equipo = ?
                            `;
                            
                            db.all(sqlMovimientos, [pokemon.id_pokemon_equipo], (errMov, movRows) => {
                                if (errMov) return rejectInner(errMov);
                                pokemon.movimientos = movRows || [];
                                resolveInner(pokemon);
                            });
                        });
                    });

                    Promise.all(promises)
                        .then(pokemonsCompletos => resolve(pokemonsCompletos))
                        .catch(reject);
                } else {
                    resolve([]);
                }
            });
        });
    }

    // actualiza solo nombre del equipo
    async updateEquipo(equipoId, cambios) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE equipos SET nombre = ? WHERE id_equipo = ?";
            db.run(sql, [cambios.nombre, equipoId], function(err) {
                if (err) return reject(err);
                resolve({
                    cambios: this.changes,
                    mensaje: "equipo actualizado"
                });
            });
        });
    }

    // actualiza equipo completo (nombre y reemplaza pokemons)
    async updateEquipoCompleto(equipoId, cambios, integrantes) {
        // usar transaccion para asegurar que todo se actualice correctamente
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                // empezar transaccion
                db.run("BEGIN TRANSACTION");

                // 1. actualizar nombre del equipo si viene
                if (cambios.nombre) {
                    db.run("UPDATE equipos SET nombre = ? WHERE id_equipo = ?", [cambios.nombre, equipoId]);
                }

                // 2. eliminar todos los pokemons actuales del equipo
                db.run("DELETE FROM equipo_pokemon WHERE id_equipo = ?", [equipoId]);

                // 3. insertar los nuevos pokemons
                const stmt = db.prepare(`
                    INSERT INTO equipo_pokemon (
                        ev_hp, ev_ataque, ev_ataque_especial, ev_defensa, ev_defensa_especial, ev_velocidad,
                        iv_hp, iv_ataque, iv_ataque_especial, iv_defensa, iv_defensa_especial, iv_velocidad,
                        id_equipo, id_naturaleza, id_pokemon, id_habilidad
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                for (const pokemon of integrantes) {
                    stmt.run([
                        pokemon.ev_hp || 0,
                        pokemon.ev_ataque || 0,
                        pokemon.ev_ataque_especial || 0,
                        pokemon.ev_defensa || 0,
                        pokemon.ev_defensa_especial || 0,
                        pokemon.ev_velocidad || 0,
                        pokemon.iv_hp || 31,
                        pokemon.iv_ataque || 31,
                        pokemon.iv_ataque_especial || 31,
                        pokemon.iv_defensa || 31,
                        pokemon.iv_defensa_especial || 31,
                        pokemon.iv_velocidad || 31,
                        equipoId,
                        pokemon.naturaleza_id,
                        pokemon.id_pokemon,
                        pokemon.habilidad_id
                    ]);
                }
                stmt.finalize();

                // 4. commit de la transaccion
                db.run("COMMIT", function(err) {
                    if (err) {
                        db.run("ROLLBACK");
                        return reject(err);
                    }
                    resolve({
                        cambios: integrantes.length,
                        mensaje: "equipo y pokemons actualizados",
                        equipo_id: equipoId,
                        total_pokemons: integrantes.length
                    });
                });
            });
        });
    }

    // elimina equipo y sus relaciones (cascada en la BD o manual)
    async deleteEquipo(equipoId) {
        return new Promise((resolve, reject) => {
            // si tienes ON DELETE CASCADE en la BD, solo necesitas esto:
            const sql = "DELETE FROM equipos WHERE id_equipo = ?";
            
            db.run(sql, [equipoId], function(err) {
                if (err) return reject(err);
                resolve({
                    cambios: this.changes,
                    mensaje: "equipo eliminado"
                });
            });
        });
    }
}

module.exports = new EquiposRepository();