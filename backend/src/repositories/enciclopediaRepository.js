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
    
    async buscarPokemons(filters) {
        return new Promise((resolve, reject) => {
            let query = `
                SELECT id_pokemon, nombre, tipo_1, tipo_2, hp_base, ataque_base, defensa_base, 
                       ataque_especial_base, defensa_especial_base, velocidad_base 
                FROM pokemon 
                WHERE 1=1
            `;
            let countQuery = "SELECT COUNT(*) as total FROM pokemon WHERE 1=1";
            const params = [];
            const countParams = [];

            const addCondition = (clause, value) => {
                query += ` AND ${clause}`;
                countQuery += ` AND ${clause}`;
                params.push(value);
                countParams.push(value);
            };

            if (filters.type) {
                query += " AND (tipo_1 = ? OR tipo_2 = ?)";
                countQuery += " AND (tipo_1 = ? OR tipo_2 = ?)";
                params.push(filters.type, filters.type);
                countParams.push(filters.type, filters.type);
            }
            
            if (filters.search) {
                addCondition("nombre LIKE ?", `${filters.search}%`);
            }

            const stats = ['hp', 'ataque', 'defensa', 'ataque_especial', 'defensa_especial', 'velocidad'];
            stats.forEach(stat => {
                if (filters[`min_${stat}`]) {
                    addCondition(`${stat}_base >= ?`, filters[`min_${stat}`]);
                }
                if (filters[`max_${stat}`]) {
                    addCondition(`${stat}_base <= ?`, filters[`max_${stat}`]);
                }
            });

            const validSortColumns = ['id_pokemon', 'nombre', 'hp_base', 'ataque_base', 'defensa_base', 'ataque_especial_base', 'defensa_especial_base', 'velocidad_base'];
            const sortColumn = validSortColumns.includes(filters.sort) ? filters.sort : 'id_pokemon';
            const sortOrder = filters.order === 'desc' ? 'DESC' : 'ASC';
            query += ` ORDER BY ${sortColumn} ${sortOrder}`;

            query += " LIMIT ? OFFSET ?";
            params.push(filters.limit, filters.offset);

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

    async buscarPokemonPorId(id) {
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
                id_pokemon: row.id_pokemon,
                nombre: row.nombre,
                tipo_1: row.tipo_1,
                tipo_2: row.tipo_2,
              
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
            console.error("Error en buscarPokemonPorId:", error);
            throw error;
        }
    }

    async buscarMovimientosDePokemon(id_pokemon, filters) {
        return new Promise((resolve, reject) => {
            let sql = `
                SELECT 
                    m.id_movimiento, m.nombre, m.tipo, m.categoria, m.poder, 
                    m.pp, m.precision, m.descripcion, pam.nivel, pam.metodo_aprendizaje 
                FROM movimiento AS m 
                JOIN pokemon_aprende_movimiento AS pam ON m.id_movimiento = pam.id_movimiento 
                WHERE pam.id_pokemon = ?
            `;
            
            const params = [id_pokemon];
            
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

    async buscarMovimientos(filters) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM movimiento WHERE 1=1";
            let countSql = "SELECT COUNT(*) as total FROM movimiento WHERE 1=1";
            const params = [];
            const countParams = [];

            const addCondition = (clause, value) => {
                sql += ` AND ${clause}`;
                countSql += ` AND ${clause}`;
                params.push(value);
                countParams.push(value);
            };

            if (filters.type) addCondition("tipo = ?", filters.type);
            if (filters.category) addCondition("categoria = ?", filters.category);
            if (filters.search) addCondition("nombre LIKE ?", `${filters.search}%`);
            if (filters.min_power) addCondition("poder >= ?", filters.min_power);
            if (filters.max_power) addCondition("poder <= ?", filters.max_power);
            if (filters.min_accuracy) addCondition("precision >= ?", filters.min_accuracy);
            if (filters.max_accuracy) addCondition("precision <= ?", filters.max_accuracy);

            sql += " LIMIT ? OFFSET ?";
            params.push(filters.limit, filters.offset);

            db.get(countSql, countParams, (errCount, countRow) => {
                if (errCount) return reject(errCount);

                db.all(sql, params, (err, rows) => {
                    if (err) return reject(err);
                    
                    resolve({
                        data: rows,
                        total: countRow.total,
                    });
                });
            });
        });
    }

    async buscarMovimientoPorId(id) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM movimiento WHERE id_movimiento = ?";
            db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

      // encuentra los pokemones que aprenden un movimiento particular (id_movimiento )
 async findPokemonsByMoveId(id_movimiento, limit, offset) {
  return new Promise((resolve, reject) => {

    const sql = `
      SELECT
        p.id_pokemon,
        p.nombre,
        pam.nivel,
        pam.metodo_aprendizaje
      FROM pokemon p
      JOIN pokemon_aprende_movimiento pam
        ON p.id_pokemon = pam.id_pokemon
      WHERE pam.id_movimiento = ?
      ORDER BY
        pam.metodo_aprendizaje ASC,
        pam.nivel ASC,
        p.nombre ASC
      LIMIT ? OFFSET ?
    `;

    const countSql = `
      SELECT COUNT(*) AS total
      FROM pokemon p
      JOIN pokemon_aprende_movimiento pam
        ON p.id_pokemon = pam.id_pokemon
      WHERE pam.id_movimiento = ?
    `;

    db.get(countSql, [id_movimiento], (errCount, countRow) => {
      if (errCount) return reject(errCount);

      db.all(sql, [id_movimiento, limit, offset], (err, rows) => {
        if (err) return reject(err);

        const total = countRow.total;

        resolve({
          data: rows,
          pagination: {
            total,
            page: Math.floor(offset / limit) + 1,
            limit,
            totalPages: Math.ceil(total / limit)
          }
        });
      });
    });
  });
}


    async buscarNaturalezas() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM naturaleza ORDER BY id_naturaleza";
            db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    async buscarHabilidades(filters) {
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

            sql += " LIMIT ? OFFSET ?";
            params.push(filters.limit, filters.offset);

            db.get(countSql, countParams, (errCount, countRow) => {
                if (errCount) return reject(errCount);

                db.all(sql, params, (err, rows) => {
                    if (err) return reject(err);
                    
                    resolve({
                        data: rows,
                        total: countRow.total
                    });
                });
            });
        });
    }
}

module.exports = new EnciclopediaRepository();