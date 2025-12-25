const db = require('../shared/db');
//
const URL = require('../shared/config');

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


class EnciclopediaRepository {
    
    async findAll(limit, offset, type, search, min_hp, max_hp, sort, order) {
        return new Promise((resolve, reject) => {
            let query = "SELECT * FROM pokemon WHERE 1=1";
            let countQuery = "SELECT COUNT(*) as total FROM pokemon WHERE 1=1";
            const params = [];
            const countParams = [];

            if (type) {
                query += " AND (tipo_1 = ? OR tipo_2 = ?)";
                countQuery += " AND (tipo_1 = ? OR tipo_2 = ?)";
                params.push(type, type);
                countParams.push(type, type);
            }
            
            if (search) {
                query += " AND nombre LIKE ?";
                countQuery += " AND nombre LIKE ?";
                params.push(`%${search}%`);
                countParams.push(`%${search}%`);
            }

            if (min_hp) {
                query += " AND hp_base >= ?";
                countQuery += " AND hp_base >= ?";
                params.push(min_hp);
                countParams.push(min_hp);
            }

            if (max_hp) {
                query += " AND hp_base <= ?";
                countQuery += " AND hp_base <= ?";
                params.push(max_hp);
                countParams.push(max_hp);
            }

            const validSortColumns = ['id_pokemon', 'nombre', 'hp_base', 'ataque_base', 'defensa_base', 'velocidad_base'];
            const sortColumn = validSortColumns.includes(sort) ? sort : 'id_pokemon';
            const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
            query += ` ORDER BY ${sortColumn} ${sortOrder}`;

            query += " LIMIT ? OFFSET ?";
            params.push(limit, offset);

            

            db.get(countQuery, countParams, (errCount, countRow) => {
                if (errCount) return reject(errCount);

                db.all(query, params, (err, rows) => {
                    if (err) return reject(err);
                    resolve({
                        data: rows,  
                        total: countRow.total
                    });
                });
            });
        });
    }

    async findPokemonById(id) {
        const sqlPokemon = "SELECT * FROM pokemon WHERE id_pokemon = ? LIMIT 1";
        const sqlHabilidades = `
            SELECT h.nombre, h.descripcion, ppth.habilidad_oculta 
            FROM habilidades h
            JOIN pokemon_puede_tener_habilidad ppth ON h.id_habilidad = ppth.id_habilidad
            WHERE ppth.id_pokemon = ?`;
    
        try {
            const row = await new Promise((resolve, reject) => {
                db.get(sqlPokemon, [id], (err, row) => err ? reject(err) : resolve(row));
            });

            if (!row) return null;

            const habRows = await new Promise((resolve, reject) => {
                db.all(sqlHabilidades, [id], (err, rows) => err ? reject(err) : resolve(rows || []));
            });

            return {
                id: row.id_pokemon,
                nombre: row.nombre,
                tipos: [row.tipo_1, row.tipo_2].filter(t => t !== null && t !== undefined),
                estadisticas: {
                    hp_base: row.hp_base,
                    ataque_base: row.ataque_base,
                    ataque_especial_base: row.ataque_especial_base,
                    defensa_base: row.defensa_base,
                    defensa_especial_base: row.defensa_especial_base,
                    velocidad_base: row.velocidad_base
                },
                habilidades: habRows.map(h => ({
                    nombre: h.nombre,
                    descripcion: h.descripcion,
                    oculta: Boolean(h.habilidad_oculta)
                }))
            };
        } catch (error) {
            console.error("Error en findPokemonById:", error);
            throw error;
        }
    }

    async findMovesByPokemonId(id_pokemon, level, method, type, category, min_power, max_power) {
        return new Promise((resolve, reject) => {
            let sql = `
                SELECT 
                    m.id_movimiento, 
                    m.nombre, 
                    m.tipo, 
                    m.categoria, 
                    m.poder, 
                    m.pp, 
                    m.precision, 
                    m.descripcion,
                    pam.nivel, 
                    pam.metodo_aprendizaje 
                FROM movimiento AS m 
                JOIN pokemon_aprende_movimiento AS pam ON m.id_movimiento = pam.id_movimiento 
                WHERE pam.id_pokemon = ?
            `;
            
            const params = [id_pokemon];
            
            if (level) {
                sql += " AND pam.nivel <= ?";
                params.push(level);
            }
            
            if (method) {
                sql += " AND pam.metodo_aprendizaje = ?";
                params.push(method);
            }
            
            if (type) {
                sql += " AND m.tipo = ?";
                params.push(type);
            }
            
            if (category) {
                sql += " AND m.categoria = ?";
                params.push(category);
            }
            
            if (min_power) {
                sql += " AND m.poder >= ?";
                params.push(min_power);
            }
            
            if (max_power) {
                sql += " AND m.poder <= ?";
                params.push(max_power);
            }
            
            sql += " ORDER BY pam.nivel ASC, m.nombre ASC";

            db.all(sql, params, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    async findAllMoves(type, category, min_power, max_power, min_accuracy, max_accuracy, search, limit, offset) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM movimiento WHERE 1=1";
            let countSql = "SELECT COUNT(*) as total FROM movimiento WHERE 1=1";
            const params = [];
            const countParams = [];

            if (type) {
                sql += " AND tipo= ?";
                countSql += " AND tipo = ?";
                params.push(type);
                countParams.push(type);
            }
            
            if (category) {
                sql += " AND categoria = ?";
                countSql += " AND categoria = ?";
                params.push(category);
                countParams.push(category);
            }
            
            if (search) {
                sql += " AND nombre LIKE ?";
                countSql += " AND nombre LIKE ?";
                params.push(`%${search}%`);
                countParams.push(`%${search}%`);
            }
            
            if (min_power) {
                sql += " AND poder >= ?";
                countSql += " AND poder >= ?";
                params.push(min_power);
                countParams.push(min_power);
            }
            
            if (max_power) {
                sql += " AND poder <= ?";
                countSql += " AND poder <= ?";
                params.push(max_power);
                countParams.push(max_power);
            }
            
            if (min_accuracy) {
                sql += " AND precision >= ?";
                countSql += " AND precision >= ?";
                params.push(min_accuracy);
                countParams.push(min_accuracy);
            }
            
            if (max_accuracy) {
                sql += " AND precision <= ?";
                countSql += " AND precision <= ?";
                params.push(max_accuracy);
                countParams.push(max_accuracy);
            }

            sql += " LIMIT ? OFFSET ?";
            params.push(limit, offset);

            db.get(countSql, countParams, (errCount, countRow) => {
                if (errCount) return reject(errCount);

                db.all(sql, params, (err, rows) => {
                    if (err) return reject(err);
                    
                    const total = countRow.total;
                    const page = Math.floor(offset / limit) + 1;
                    
                    resolve({
                        data: rows,
                        pagination: {
                            total: total,
                            page: page,
                            limit: limit,
                            totalPages: Math.ceil(total / limit)
                        }
                    });
                });
            });
        });
    }

    async findAllNatures() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM naturaleza ORDER BY id_naturaleza";
            db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    async findAllAbilities(search, limit, offset) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM habilidades WHERE 1=1";
            let countSql = "SELECT COUNT(*) as total FROM habilidades WHERE 1=1";
            const params = [];
            const countParams = [];

            if (search) {
                sql += " AND nombre LIKE ?";
                countSql += " AND nombre LIKE ?";
                params.push(`%${search}%`);
                countParams.push(`%${search}%`);
            }

            sql += " LIMIT ? OFFSET ?";
            params.push(limit, offset);

            db.get(countSql, countParams, (errCount, countRow) => {
                if (errCount) return reject(errCount);

                db.all(sql, params, (err, rows) => {
                    if (err) return reject(err);
                    
                    const total = countRow.total;
                    const page = Math.floor(offset / limit) + 1;
                    
                    resolve({
                        data: rows,
                        pagination: {
                            total: total,
                            page: page,
                            limit: limit,
                            totalPages: Math.ceil(total / limit)
                        }
                    });
                });
            });
        });
    }
}

module.exports = new EnciclopediaRepository();