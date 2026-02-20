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

class EquipoRepository {

    async verificarExistenciaUsuario(idUsuario) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT id_usuario FROM usuarios WHERE id_usuario = ? LIMIT 1";
            db.get(sql, [idUsuario], (err, row) => {
                if (err) return reject(err);
                resolve(!!row);
            });
        });
    }

    async verificarExistenciaPokemon(idPokemon) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT id_pokemon FROM pokemon WHERE id_pokemon = ? LIMIT 1";
            db.get(sql, [idPokemon], (err, row) => {
                if (err) return reject(err);
                resolve(!!row);
            });
        });
    }

    async buscarPorIdUsuario(idUsuario) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM equipos WHERE id_usuario = ? ORDER BY fecha_creacion DESC";
            db.all(sql, [idUsuario], (err, rows) => {
                if (err) return reject(err);
                resolve(rows || []);
            });
        });
    }

    async crear(equipoData) {
        return new Promise((resolve, reject) => {
            const runTransaction = async () => {
                try {
                    await new Promise((res, rej) => db.run("BEGIN TRANSACTION", (err) => err ? rej(err) : res()));

                    const sqlEquipo = "INSERT INTO equipos (nombre, fecha_creacion, id_usuario) VALUES (?, datetime('now'), ?)";
                    const equipoId = await new Promise((res, rej) => {
                        db.run(sqlEquipo, [equipoData.nombre, equipoData.id_usuario], function (err) {
                            if (err) return rej(err);
                            res(this.lastID);
                        });
                    });

                    if (equipoData.pokemons && equipoData.pokemons.length > 0) {
                        const stmtPokemon = db.prepare(`
                            INSERT INTO equipo_pokemon (
                                ev_hp, ev_ataque, ev_ataque_especial, ev_defensa, ev_defensa_especial, ev_velocidad,
                                iv_hp, iv_ataque, iv_ataque_especial, iv_defensa, iv_defensa_especial, iv_velocidad,
                                id_equipo, id_naturaleza, id_pokemon, id_habilidad
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `);

                        const stmtMovimiento = db.prepare(`
                            INSERT INTO pokemon_tiene_movimiento (id_pokemon_equipo, id_movimiento, slot) 
                            VALUES (?, ?, ?)
                        `);

                        try {
                            for (const p of equipoData.pokemons) {
                                const pokemonEquipoId = await new Promise((res, rej) => {
                                    stmtPokemon.run(
                                        p.ev_hp || 0, p.ev_ataque || 0, p.ev_ataque_especial || 0, p.ev_defensa || 0,
                                        p.ev_defensa_especial || 0, p.ev_velocidad || 0,
                                        p.iv_hp || 31, p.iv_ataque || 31, p.iv_ataque_especial || 31,
                                        p.iv_defensa || 31, p.iv_defensa_especial || 31, p.iv_velocidad || 31,
                                        equipoId, p.naturaleza_id || 1, p.id_pokemon, p.habilidad_id || 1,
                                        function (err) {
                                            if (err) return rej(err);
                                            res(this.lastID);
                                        }
                                    );
                                });

                                if (p.movimientos && Array.isArray(p.movimientos)) {
                                    for (let i = 0; i < p.movimientos.length; i++) {
                                        const movId = p.movimientos[i];
                                        if (movId) {
                                            await new Promise((res, rej) => {
                                                stmtMovimiento.run(pokemonEquipoId, movId, i + 1, (err) => {
                                                    if (err) return rej(err);
                                                    res();
                                                });
                                            });
                                        }
                                    }
                                }
                            }
                        } finally {
                            stmtPokemon.finalize();
                            stmtMovimiento.finalize();
                        }
                    }

                    await new Promise((res, rej) => db.run("COMMIT", (err) => err ? rej(err) : res()));
                    resolve(equipoId);

                } catch (error) {
                    db.run("ROLLBACK", () => reject(error));
                }
            };

            runTransaction();
        });
    }

    async buscarPorId(equipoId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM equipos WHERE id_equipo = ? LIMIT 1";
            db.get(sql, [equipoId], (err, row) => {
                if (err) return reject(err);
                resolve(row || null);
            });
        });
    }

    async buscarPokemonsPorId(equipoId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    ep.id_pokemon_equipo, ep.ev_hp, ep.ev_ataque, ep.ev_ataque_especial, ep.ev_defensa, 
                    ep.ev_defensa_especial, ep.ev_velocidad, ep.iv_hp, ep.iv_ataque, ep.iv_ataque_especial, 
                    ep.iv_defensa, ep.iv_defensa_especial, ep.iv_velocidad, p.id_pokemon, p.nombre as pokemon_nombre, 
                    p.tipo_1, p.tipo_2, p.hp_base, p.ataque_base, p.ataque_especial_base, p.defensa_base, 
                    p.defensa_especial_base, p.velocidad_base, n.nombre as naturaleza_nombre, n.estadistica_mas, 
                    n.estadistica_menos, h.nombre as habilidad_nombre, h.descripcion as habilidad_descripcion
                FROM equipo_pokemon ep
                JOIN pokemon p ON ep.id_pokemon = p.id_pokemon
                JOIN naturaleza n ON ep.id_naturaleza = n.id_naturaleza
                JOIN habilidades h ON ep.id_habilidad = h.id_habilidad
                WHERE ep.id_equipo = ?
                ORDER BY ep.id_pokemon_equipo
            `;

            db.all(sql, [equipoId], (err, rows) => {
                if (err) return reject(err);

                if (!rows || rows.length === 0) return resolve([]);

                const promises = rows.map(pokemon => {
                    return new Promise((resolveInner, rejectInner) => {
                        const sqlMovimientos = `
                            SELECT m.id_movimiento, m.nombre, m.tipo, m.categoria, m.poder, m.pp, m.descripcion, m.precision
                            FROM movimiento m
                            JOIN pokemon_tiene_movimiento ptm ON m.id_movimiento = ptm.id_movimiento
                            WHERE ptm.id_pokemon_equipo = ?
                        `;
                        db.all(sqlMovimientos, [pokemon.id_pokemon_equipo], (errMov, movRows) => {
                            if (errMov) return rejectInner(errMov);
                            pokemon.movimientos = movRows || [];
                            resolveInner(pokemon);
                        });
                    });
                });

                Promise.all(promises).then(resolve).catch(reject);
            });
        });
    }

    async actualizarNombre(equipoId, nombre) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE equipos SET nombre = ? WHERE id_equipo = ?";
            db.run(sql, [nombre, equipoId], function (err) {
                if (err) return reject(err);
                resolve({ cambios: this.changes });
            });
        });
    }

    async actualizarCompleto(equipoId, nombre, integrantes) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run("BEGIN TRANSACTION");

                if (nombre) {
                    db.run("UPDATE equipos SET nombre = ? WHERE id_equipo = ?", [nombre, equipoId]);
                }

                db.run("DELETE FROM pokemon_tiene_movimiento WHERE id_pokemon_equipo IN (SELECT id_pokemon_equipo FROM equipo_pokemon WHERE id_equipo = ?)", [equipoId]);
                db.run("DELETE FROM equipo_pokemon WHERE id_equipo = ?", [equipoId]);

                const stmt = db.prepare(`
                    INSERT INTO equipo_pokemon (
                        ev_hp, ev_ataque, ev_ataque_especial, ev_defensa, ev_defensa_especial, ev_velocidad,
                        iv_hp, iv_ataque, iv_ataque_especial, iv_defensa, iv_defensa_especial, iv_velocidad,
                        id_equipo, id_naturaleza, id_pokemon, id_habilidad
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                integrantes.forEach(p => {
                    stmt.run(p.ev_hp || 0, p.ev_ataque || 0, p.ev_ataque_especial || 0, p.ev_defensa || 0,
                        p.ev_defensa_especial || 0, p.ev_velocidad || 0, p.iv_hp || 31, p.iv_ataque || 31,
                        p.iv_ataque_especial || 31, p.iv_defensa || 31, p.iv_defensa_especial || 31,
                        p.iv_velocidad || 31, equipoId, p.naturaleza_id, p.id_pokemon, p.habilidad_id);
                });

                stmt.finalize(err => {
                    if (err) {
                        db.run("ROLLBACK");
                        return reject(err);
                    }
                    db.run("COMMIT", commitErr => {
                        if (commitErr) {
                            db.run("ROLLBACK");
                            return reject(commitErr);
                        }
                        resolve({ equipo_id: equipoId, total_pokemons: integrantes.length });
                    });
                });
            });
        });
    }

    async eliminar(equipoId) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM equipos WHERE id_equipo = ?";
            db.run(sql, [equipoId], function (err) {
                if (err) return reject(err);
                resolve({ cambios: this.changes });
            });
        });
    }

    async actualizarPokemon(idPokemonEquipo, datos) {
        return new Promise((resolve, reject) => {
            const sqlSelect = "SELECT * FROM equipo_pokemon WHERE id_pokemon_equipo = ?";
            db.get(sqlSelect, [idPokemonEquipo], (err, pokemonActual) => {
                if (err) return reject(err);
                if (!pokemonActual) return reject(new Error("El pokemon en el equipo no existe."));

                const nuevosEVs = { ...pokemonActual, ...datos };
                const totalEVs = (nuevosEVs.ev_hp || 0) + (nuevosEVs.ev_ataque || 0) + (nuevosEVs.ev_defensa || 0) +
                    (nuevosEVs.ev_ataque_especial || 0) + (nuevosEVs.ev_defensa_especial || 0) + (nuevosEVs.ev_velocidad || 0);

                if (totalEVs > 510) {
                    return reject(new Error(`La suma total de EVs (${totalEVs}) no puede superar 510.`));
                }

                const campos = Object.keys(datos).map(k => `${k} = ?`).join(', ');
                if (campos.length === 0) return resolve({ cambios: 0 });

                const valores = [...Object.values(datos), idPokemonEquipo];
                const sqlUpdate = `UPDATE equipo_pokemon SET ${campos} WHERE id_pokemon_equipo = ?`;

                db.run(sqlUpdate, valores, function (err) {
                    if (err) return reject(err);
                    resolve({ cambios: this.changes });
                });
            });
        });
    }

    async agregarMovimiento(idPokemonEquipo, idMovimiento, slot) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT OR REPLACE INTO pokemon_tiene_movimiento (id_pokemon_equipo, id_movimiento, slot) VALUES (?, ?, ?)";
            db.run(sql, [idPokemonEquipo, idMovimiento, slot], function (err) {
                if (err) return reject(err);
                resolve({ cambios: this.changes, slot });
            });
        });
    }

    async buscarPokemonEquipoPorId(idPokemonEquipo) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM equipo_pokemon WHERE id_pokemon_equipo = ?";
            db.get(sql, [idPokemonEquipo], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    async eliminarMovimiento(idPokemonEquipo, slot) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM pokemon_tiene_movimiento WHERE id_pokemon_equipo = ? AND slot = ?";
            db.run(sql, [idPokemonEquipo, slot], function (err) {
                if (err) return reject(err);
                if (this.changes === 0) return reject(new Error(`No se encontró un movimiento en la slot ${slot}.`));
                resolve({ cambios: this.changes });
            });
        });
    }
}

module.exports = new EquipoRepository();