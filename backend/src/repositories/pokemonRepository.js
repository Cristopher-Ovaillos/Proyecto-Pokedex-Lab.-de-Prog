const db = require('../shared/db');

class PokemonRepository {
    //findAll y findOne, es convencion pero se puede cambiar a cualquiera
    //---
    async findAll({ limit, offset, type, search }) {
        return new Promise((resolve, reject) => {
            let query = "SELECT * FROM pokemon WHERE 1=1";
            //el 1=1 siempre es true, por si no hay ninguna ? devuelve todo.
            let countQuery = "SELECT COUNT(*) as total FROM pokemon WHERE 1=1";
            const params = [];

            if (type) {
                const filter = " AND (tipo_1 = ? OR tipo_2 = ?)";
                query += filter; countQuery += filter;
                params.push(type, type);
            }
            if (search) {
                const filter = " AND nombre LIKE ?";
                query += filter; countQuery += filter;
                //aca se controla el LIKE (si usamos solo %${search} buscamos los search que empiecen con X substring)
                params.push(`%${search}%`);
            }

            // agregar paginacion a la query principal 
            query += " LIMIT ? OFFSET ?";
            const queryParams = [...params, limit, offset];

            // Ejecutamos ambas consultas (Data y Metadata)
            db.get(countQuery, params, (errCount, countRow) => {
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
    //---
    async findOne(id) {
        const sqlPokemon = "SELECT * FROM pokemon WHERE id_pokemon = ? LIMIT 1";
        const sqlHabilidades = `
        SELECT h.nombre, h.descripcion, ppth.habilidad_oculta 
        FROM habilidades h
        JOIN pokemon_puede_tener_habilidad ppth ON h.id_habilidad = ppth.id_habilidad
        WHERE ppth.id_pokemon = ?`;
        const sqlMovimientos = `
        SELECT m.nombre, m.tipo, m.categoria, pam.nivel, pam.metodo_aprendizaje
        FROM movimiento m
        JOIN pokemon_aprende_movimiento pam ON m.id_movimiento = pam.id_movimiento
        WHERE pam.id_pokemon = ?`;

        try {
            const row = await new Promise((resolve, reject) => {
                db.get(sqlPokemon, [id], (err, row) => err ? reject(err) : resolve(row));
            });

            // veo si la tupla del pokemon existe
            if (!row) return null;

            const habRows = await new Promise((resolve, reject) => {
                db.all(sqlHabilidades, [id], (err, rows) => err ? reject(err) : resolve(rows || []));
            });

            const movRows = await new Promise((resolve, reject) => {
                db.all(sqlMovimientos, [id], (err, rows) => err ? reject(err) : resolve(rows || []));
            });

            //mapeo
            return {
                id: row.id_pokemon,
                nombre: row.nombre,
                // Verificamos que los nombres de columnas coincidan con tu tabla 'pokemon'
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
                })),
                movimientos: movRows.map(m => ({
                    nombre: m.nombre,
                    tipo: m.tipo,
                    categoria: m.categoria,
                    aprendizaje: {
                        nivel: m.nivel,
                        metodo: m.metodo_aprendizaje
                    }
                }))
            };

        } catch (error) {
            console.error("Error en findOne:", error);
            throw error;
        }
    }



}
module.exports = new PokemonRepository();