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

*/

class EnciclopediaRepository {
    
    // 1. Lista Pokémon con filtros (YA LO TIENES)
    async findAll({ limit, offset, type, search, min_hp, max_hp, sort = 'id_pokemon', order = 'ASC' }) {
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

            query += " LIMIT ? OFFSET ?";
            const queryParams = [...params, limit, offset];

            db.get(countQuery, countParams, (errCount, countRow) => {
                if (errCount) return reject(errCount);

                db.all(query, queryParams, (err, rows) => {
                    if (err) return reject(err);
                    resolve({
                        data: rows,
                        total: countRow.total
                    });
                });
            });
        });
    }

    // 2. Obtener Pokémon por ID (CORREGIR NOMBRE)
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

    // 3. Obtener movimientos de un Pokémon (CORREGIDO)
    async findMovesByPokemonId(id_pokemon, filters = {}) {
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
            
            // Aplicar filtros
            if (filters.level) {
                sql += " AND pam.nivel <= ?";
                params.push(filters.level);
            }
            
            if (filters.method) {
                sql += " AND pam.metodo_aprendizaje = ?";
                params.push(filters.method);
            }
            
            if (filters.type) {
                sql += " AND m.tipo = ?";
                params.push(filters.type);
            }
            
            if (filters.category) {
                sql += " AND m.categoria = ?";
                params.push(filters.category);
            }
            
            if (filters.min_power) {
                sql += " AND m.poder >= ?";
                params.push(filters.min_power);
            }
            
            if (filters.max_power) {
                sql += " AND m.poder <= ?";
                params.push(filters.max_power);
            }
            
            sql += " ORDER BY pam.nivel ASC, m.nombre ASC";

            db.all(sql, params, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    // 4. Listar movimientos generales (MEJORADO)
    async findAllMoves(filters = {}) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM movimiento WHERE 1=1";
            let countSql = "SELECT COUNT(*) as total FROM movimiento WHERE 1=1";
            const params = [];
            const countParams = [];

            if (filters.type) {
                sql += " AND tipo = ?";
                countSql += " AND tipo = ?";
                params.push(filters.type);
                countParams.push(filters.type);
            }
            
            if (filters.category) {
                sql += " AND categoria = ?";
                countSql += " AND categoria = ?";
                params.push(filters.category);
                countParams.push(filters.category);
            }
            
            if (filters.search) {
                sql += " AND nombre LIKE ?";
                countSql += " AND nombre LIKE ?";
                params.push(`%${filters.search}%`);
                countParams.push(`%${filters.search}%`);
            }
            
            if (filters.min_power) {
                sql += " AND poder >= ?";
                countSql += " AND poder >= ?";
                params.push(filters.min_power);
                countParams.push(filters.min_power);
            }
            
            if (filters.max_power) {
                sql += " AND poder <= ?";
                countSql += " AND poder <= ?";
                params.push(filters.max_power);
                countParams.push(filters.max_power);
            }
            
            if (filters.min_accuracy) {
                sql += " AND precision >= ?";
                countSql += " AND precision >= ?";
                params.push(filters.min_accuracy);
                countParams.push(filters.min_accuracy);
            }
            
            if (filters.max_accuracy) {
                sql += " AND precision <= ?";
                countSql += " AND precision <= ?";
                params.push(filters.max_accuracy);
                countParams.push(filters.max_accuracy);
            }

            // Paginación
            if (filters.limit && filters.offset !== undefined) {
                sql += " LIMIT ? OFFSET ?";
                params.push(filters.limit, filters.offset);
            } else if (filters.limit) {
                sql += " LIMIT ?";
                params.push(filters.limit);
            }

            // Obtener total y datos
            db.get(countSql, countParams, (errCount, countRow) => {
                if (errCount) return reject(errCount);

                db.all(sql, params, (err, rows) => {
                    if (err) return reject(err);
                    
                    const total = countRow.total;
                    const limit = filters.limit || total;
                    const page = filters.offset ? Math.floor(filters.offset / limit) + 1 : 1;
                    
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

    // 5. Listar naturalezas (NUEVO MÉTODO)
    async findAllNatures() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM naturaleza ORDER BY id_naturaleza";
            db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    // 6. Listar habilidades (NUEVO MÉTODO)
    async findAllAbilities(filters = {}) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM habilidades WHERE 1=1";
            let countSql = "SELECT COUNT(*) as total FROM habilidades WHERE 1=1";
            const params = [];
            const countParams = [];

            if (filters.search) {
                sql += " AND nombre LIKE ?";
                countSql += " AND nombre LIKE ?";
                params.push(`%${filters.search}%`);
                countParams.push(`%${filters.search}%`);
            }

            // Paginación
            if (filters.limit && filters.offset !== undefined) {
                sql += " LIMIT ? OFFSET ?";
                params.push(filters.limit, filters.offset);
            } else if (filters.limit) {
                sql += " LIMIT ?";
                params.push(filters.limit);
            }

            // Obtener total y datos
            db.get(countSql, countParams, (errCount, countRow) => {
                if (errCount) return reject(errCount);

                db.all(sql, params, (err, rows) => {
                    if (err) return reject(err);
                    
                    const total = countRow.total;
                    const limit = filters.limit || total;
                    const page = filters.offset ? Math.floor(filters.offset / limit) + 1 : 1;
                    
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