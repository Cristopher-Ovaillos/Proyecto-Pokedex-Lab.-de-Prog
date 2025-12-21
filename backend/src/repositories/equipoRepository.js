const db = require('../shared/db');

class EquipoRepository {
    // crear equipo
    async create({ nombre, id_usuario }) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO equipos (nombre, id_usuario, fecha_creacion) VALUES (?, ?, ?)";
            const fecha = new Date().toISOString();
            //(sql, [los ? ? ?], function)
            db.run(sql, [nombre, id_usuario, fecha], function(err) {
                if (err) return reject(err);
                // devolvemos el id
                resolve({ id_equipo: this.lastID, nombre, id_usuario, fecha });
            });
        });
    }

    // lista para el usuario
    async findByUserId(id_usuario) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM equipos WHERE id_usuario = ?";
            db.all(sql, [id_usuario], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

 async addPokemonToTeam(id_equipo, pokemonData) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO equipo_pokemon (
                    id_equipo, 
                    id_pokemon, 
                    id_naturaleza, 
                    id_habilidad, 
                    ev_hp, ev_ataque, ev_defensa, ev_ataque_especial, ev_defensa_especial, ev_velocidad,
                    iv_hp, iv_ataque, iv_defensa, iv_ataque_especial, iv_defensa_especial, iv_velocidad
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            // preparacion
            const values = [
                id_equipo,
                pokemonData.id_pokemon,
                pokemonData.id_naturaleza,
                pokemonData.id_habilidad,
                pokemonData.ev_hp || 0,
                pokemonData.ev_ataque || 0,
                pokemonData.ev_defensa || 0,
                pokemonData.ev_ataque_especial || 0,
                pokemonData.ev_defensa_especial || 0,
                pokemonData.ev_velocidad || 0,
                pokemonData.iv_hp || 31, //
                pokemonData.iv_ataque || 31,
                pokemonData.iv_defensa || 31,
                pokemonData.iv_ataque_especial || 31,
                pokemonData.iv_defensa_especial || 31,
                pokemonData.iv_velocidad || 31
            ];

            // Usamos db.run para inserciones y actualizaciones
            db.run(sql, values, function(err) {
                if (err) return reject(err);
                // Devolvemos el ID del nuevo registro creado en equipo_pokemon
                resolve({ id_pokemon_equipo: this.lastID, ...pokemonData });
            });
        });
    }


    async findByIdFull(id_equipo) {
        return new Promise((resolve, reject) => {
            // Este SQL une las tablas para traer al Pokémon configurado, su especie base, habilidad y naturaleza
            const sql = `
                SELECT 
                    e.id_equipo, e.nombre AS nombre_equipo, e.fecha_creacion,
                    ep.id_pokemon_equipo, 
                    ep.ev_hp, ep.ev_ataque, ep.ev_ataque_especial, ep.ev_defensa, ep.ev_defensa_especial, ep.ev_velocidad,
                    ep.iv_hp, ep.iv_ataque, ep.iv_ataque_especial, ep.iv_defensa, ep.iv_defensa_especial, ep.iv_velocidad,
                    p.id_pokemon, p.nombre AS nombre_pokemon, 
                    p.hp_base, p.ataque_base, p.ataque_especial_base, p.defensa_base, p.defensa_especial_base, p.velocidad_base,
                    n.nombre AS naturaleza, n.estadistica_mas, n.estadistica_menos,
                    h.nombre AS habilidad, h.descripcion AS habilidad_desc
                FROM equipos e
                LEFT JOIN equipo_pokemon ep ON e.id_equipo = ep.id_equipo
                LEFT JOIN pokemon p ON ep.id_pokemon = p.id_pokemon
                LEFT JOIN naturaleza n ON ep.id_naturaleza = n.id_naturaleza
                LEFT JOIN habilidades h ON ep.id_habilidad = h.id_habilidad
                WHERE e.id_equipo = ?
            `;
            //nos devuelve todos los pokemon, (all)
            db.all(sql, [id_equipo], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    // UPDATE
    async update(id, { nombre }) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE equipos SET nombre = ? WHERE id_equipo = ?";
            db.run(sql, [nombre, id], function(err) {
                if (err) reject(err);
                resolve(this.changes > 0);
            });
        });
    }

    // eliminar equipo
    async delete(id) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM equipos WHERE id_equipo = ?";
            db.run(sql, [id], function(err) {
                if (err) reject(err);
                resolve(this.changes > 0);
            });
        });
    }
}

module.exports = new EquipoRepository();