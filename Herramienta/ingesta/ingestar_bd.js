const fs = require('fs');

// Función para traducir categorías de inglés a español


// Función con reintentos para evitar errores de conexión
async function fetchConReintentos(url, reintentos = 3) {
    for (let i = 0; i < reintentos; i++) {
        try {
            const respuesta = await fetch(url);
            if (!respuesta.ok) {
                throw new Error(`HTTP ${respuesta.status}`);
            }
            const contentType = respuesta.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Respuesta no es JSON');
            }
            return await respuesta.json();
        } catch (error) {
            if (i === reintentos - 1) throw error;
            console.log(`Reintento ${i + 1} para ${url}`);
            await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
        }
    }
}

async function generarInsertsSQL() {
    const totalPokemon = 649;
    const archivoDestino = 'pokemon_data_completo.sql';
    
    // Limpiar el archivo al inicio
    fs.writeFileSync(archivoDestino, '-- DATOS COMPLETOS DE POKEMON (GENERACIONES 1-5)\n', { flag: 'w' });
    fs.appendFileSync(archivoDestino, '-- GENERADO DESDE POKEAPI\n');

    
    // Sets para evitar duplicados
    const habilidadesSet = new Set();
    const movimientosSet = new Set();
    const habilidadesPorPokemon = new Map();
    const movimientosPorPokemon = new Map();
    
    console.log('Obteniendo datos de los 649 pokemon...');
    console.log('Esto puede tomar 15-20 minutos...');
    
 
    
    // Primer paso: obtener datos de los pokemon
    for (let i = 1; i <= totalPokemon; i++) {
       
        
        try {
            // Obtener datos del pokemon con reintentos
            const data = await fetchConReintentos(`https://pokeapi.co/api/v2/pokemon/${i}`);
            
            // Datos del pokemon
            const id = data.id;
            const nombre = data.name.replace(/'/g, "''");
            const tipo_1 = data.types[0].type.name;
            const tipo_2 = data.types[1] ? data.types[1].type.name : null;
            
            // Stats base
            const hp = data.stats[0].base_stat;
            const ataque = data.stats[1].base_stat;
            const defensa = data.stats[2].base_stat;
            const at_especial = data.stats[3].base_stat;
            const def_especial = data.stats[4].base_stat;
            const velocidad = data.stats[5].base_stat;
            
            // Guardar habilidades de este pokemon
            const habilidadesPokemon = [];
            for (const habilidad of data.abilities) {
                const habilidadUrl = habilidad.ability.url;
                const habilidadId = habilidadUrl.split('/').filter(Boolean).pop();
                const habilidadNombre = habilidad.ability.name.replace(/'/g, "''");
                const esOculta = habilidad.is_hidden ? 1 : 0;
                
                habilidadesSet.add(JSON.stringify({
                    id: habilidadId,
                    nombre: habilidadNombre,
                    url: habilidadUrl
                }));
                
                habilidadesPokemon.push({
                    pokemon_id: id,
                    habilidad_id: habilidadId,
                    es_oculta: esOculta
                });
            }
            habilidadesPorPokemon.set(id, habilidadesPokemon);
            
            // Guardar movimientos que puede aprender este pokemon (limitado a 10 por pokemon)
            const movimientosPokemon = [];
            const movimientosUnicosEnPokemon = new Set();
            
            for (const movimiento of data.moves) {
                
                const movimientoUrl = movimiento.move.url;
                const movimientoId = movimientoUrl.split('/').filter(Boolean).pop();
                const movimientoNombre = movimiento.move.name.replace(/'/g, "''");
                
                if (movimientosUnicosEnPokemon.has(movimientoId)) continue;
                movimientosUnicosEnPokemon.add(movimientoId);
                
                // Guardar en set global
                movimientosSet.add(JSON.stringify({
                    id: movimientoId,
                    nombre: movimientoNombre,
                    url: movimientoUrl
                }));
                
                // Solo el primer método de aprendizaje
                if (movimiento.version_group_details.length > 0) {
                    const detalle = movimiento.version_group_details[0];
                    const nivelAprendizaje = detalle.level_learned_at || null;
                    const metodoAprendizaje = detalle.move_learn_method.name.replace(/'/g, "''");
                    
                    movimientosPokemon.push({
                        pokemon_id: id,
                        movimiento_id: movimientoId,
                        nivel: nivelAprendizaje,
                        metodo: metodoAprendizaje
                    });
                }
            }
            movimientosPorPokemon.set(id, movimientosPokemon);
            
            // Insert del pokemon
            const tipo2Value = tipo_2 ? `'${tipo_2}'` : 'NULL';
            const sqlPokemon = `INSERT INTO pokemon (id_pokemon, nombre, tipo_1, tipo_2, hp_base, ataque_base, ataque_especial_base, defensa_base, defensa_especial_base, velocidad_base) VALUES (${id}, '${nombre}', '${tipo_1}', ${tipo2Value}, ${hp}, ${ataque}, ${at_especial}, ${defensa}, ${def_especial}, ${velocidad});\n`;
            fs.appendFileSync(archivoDestino, sqlPokemon);
            
            // Mostrar progreso
            if (i % 50 === 0) {
                console.log(`Progreso: ${i}/${totalPokemon} pokemon procesados...`);
            }
            
            // Pausa para no saturar la API
            await new Promise(resolve => setTimeout(resolve, 300));
            
        } catch (error) {
            console.error(`Error con pokemon id ${i}:`, error.message);
        }
    }
    
    // Segundo paso: obtener detalles de habilidades
    console.log('\nObteniendo detalles de habilidades...');
    const habilidadesArray = Array.from(habilidadesSet).map(JSON.parse);
    
    fs.appendFileSync(archivoDestino, '\n-- HABILIDADES\n');
    
    for (let i = 0; i < habilidadesArray.length; i++) {
        try {
            const habilidad = habilidadesArray[i];
            const data = await fetchConReintentos(habilidad.url);
            
            const nombre = data.name.replace(/'/g, "''");
            const descripcionEntry = data.effect_entries.find(entry => entry.language.name === 'en') ||
                                   data.flavor_text_entries.find(entry => entry.language.name === 'en');
            const descripcion = (descripcionEntry?.effect || descripcionEntry?.flavor_text || 'Sin descripcion').replace(/'/g, "''").substring(0, 255);
            
            const sqlHabilidad = `INSERT INTO habilidades (id_habilidad, nombre, descripcion) VALUES (${habilidad.id}, '${nombre}', '${descripcion}');\n`;
            fs.appendFileSync(archivoDestino, sqlHabilidad);
            
            if (i % 50 === 0) {
                console.log(`Progreso habilidades: ${i + 1}/${habilidadesArray.length}`);
            }
            
            await new Promise(resolve => setTimeout(resolve, 200));
            
        } catch (error) {
            console.error(`Error con habilidad:`, error.message);
        }
    }
    
    // Tercer paso: obtener detalles de movimientos CON TRADUCCIÓN DE CATEGORÍAS
    console.log('\nObteniendo detalles de movimientos (traduciendo categorías)...');
    const movimientosArray = Array.from(movimientosSet).map(JSON.parse);
    
    fs.appendFileSync(archivoDestino, '\n-- MOVIMIENTOS\n');
    
    for (let i = 0; i < movimientosArray.length; i++) {
        try {
            const movimiento = movimientosArray[i];
            const data = await fetchConReintentos(movimiento.url);
            
            const nombre = data.name.replace(/'/g, "''");
            const tipo = data.type?.name || 'normal';
            
            // ¡TRADUCCIÓN DE CATEGORÍA IMPORTANTE!
            const categoriaIngles = data.damage_class?.name || 'status';
            const categoria = categoriaIngles;
            
            const poder = data.power || 0;
            const pp = data.pp || 0;
            const precision = data.accuracy || 100;
            
            const descripcionEntry = data.effect_entries.find(entry => entry.language.name === 'en') ||
                                   data.flavor_text_entries.find(entry => entry.language.name === 'en');
            const descripcion = (descripcionEntry?.effect || descripcionEntry?.flavor_text || 'Sin descripcion').replace(/'/g, "''").substring(0, 255);
            
            const sqlMovimiento = `INSERT INTO movimiento (id_movimiento, nombre, tipo, categoria, poder, pp, descripcion, precision) VALUES (${movimiento.id}, '${nombre}', '${tipo}', '${categoria}', ${poder}, ${pp}, '${descripcion}', ${precision});\n`;
            fs.appendFileSync(archivoDestino, sqlMovimiento);
            
            if (i % 100 === 0) {
                console.log(`Progreso movimientos: ${i + 1}/${movimientosArray.length} (${categoriaIngles} -> ${categoria})`);
            }
            
            await new Promise(resolve => setTimeout(resolve, 200));
            
        } catch (error) {
            console.error(`Error con movimiento:`, error.message);
        }
    }
    
    // Cuarto paso: insertar relaciones pokemon-habilidad
    console.log('\nInsertando relaciones pokemon-habilidad...');
    fs.appendFileSync(archivoDestino, '\n-- RELACIONES POKEMON-HABILIDAD\n');
    
    let contadorRelacionesHabilidad = 0;
    for (const [pokemonId, habilidades] of habilidadesPorPokemon) {
        for (const habilidad of habilidades) {
            const sqlRelacion = `INSERT INTO pokemon_puede_tener_habilidad (id_pokemon, id_habilidad, habilidad_oculta) VALUES (${pokemonId}, ${habilidad.habilidad_id}, ${habilidad.es_oculta});\n`;
            fs.appendFileSync(archivoDestino, sqlRelacion);
            contadorRelacionesHabilidad++;
        }
    }
    
    // Quinto paso: insertar relaciones pokemon-movimiento
    console.log('\nInsertando relaciones pokemon-movimiento...');
    fs.appendFileSync(archivoDestino, '\n-- RELACIONES POKEMON-MOVIMIENTO\n');
    
    let contadorRelacionesMovimiento = 0;
    for (const [pokemonId, movimientos] of movimientosPorPokemon) {
        for (const movimiento of movimientos) {
            if (movimiento.movimiento_id && movimiento.metodo) {
                const nivelValue = movimiento.nivel ? movimiento.nivel : 'NULL';
                const sqlRelacion = `INSERT INTO pokemon_aprende_movimiento (id_pokemon, id_movimiento, nivel, metodo_aprendizaje) VALUES (${pokemonId}, ${movimiento.movimiento_id}, ${nivelValue}, '${movimiento.metodo}');\n`;
                fs.appendFileSync(archivoDestino, sqlRelacion);
                contadorRelacionesMovimiento++;
            }
        }
    }
    
    // Sexto paso: insertar naturalezas predefinidas
    console.log('\nInsertando naturalezas predefinidas...');
    fs.appendFileSync(archivoDestino, '\n-- NATURALEZAS PREDEFINIDAS\n');
    
    const naturalezas = [
        [1, 'hardy', null, null],
        [2, 'lonely', 'ataque', 'defensa'],
        [3, 'brave', 'ataque', 'velocidad'],
        [4, 'adamant', 'ataque', 'ataque_especial'],
        [5, 'naughty', 'ataque', 'defensa_especial'],
        [6, 'bold', 'defensa', 'ataque'],
        [7, 'docile', null, null],
        [8, 'relaxed', 'defensa', 'velocidad'],
        [9, 'impish', 'defensa', 'ataque_especial'],
        [10, 'lax', 'defensa', 'defensa_especial'],
        [11, 'timid', 'velocidad', 'ataque'],
        [12, 'hasty', 'velocidad', 'defensa'],
        [13, 'serious', null, null],
        [14, 'jolly', 'velocidad', 'ataque_especial'],
        [15, 'naive', 'velocidad', 'defensa_especial'],
        [16, 'modest', 'ataque_especial', 'ataque'],
        [17, 'mild', 'ataque_especial', 'defensa'],
        [18, 'quiet', 'ataque_especial', 'velocidad'],
        [19, 'bashful', null, null],
        [20, 'rash', 'ataque_especial', 'defensa_especial'],
        [21, 'calm', 'defensa_especial', 'ataque'],
        [22, 'gentle', 'defensa_especial', 'defensa'],
        [23, 'sassy', 'defensa_especial', 'velocidad'],
        [24, 'careful', 'defensa_especial', 'ataque_especial'],
        [25, 'quirky', null, null]
    ];
    
    for (const naturaleza of naturalezas) {
        const [id, nombre, mas, menos] = naturaleza;
        const masValue = mas ? `'${mas}'` : 'NULL';
        const menosValue = menos ? `'${menos}'` : 'NULL';
        const sqlNaturaleza = `INSERT INTO naturaleza (id_naturaleza, nombre, estadistica_mas, estadistica_menos) VALUES (${id}, '${nombre}', ${masValue}, ${menosValue});\n`;
        fs.appendFileSync(archivoDestino, sqlNaturaleza);
    }
    
    // Resumen final
    console.log('\n' + '='.repeat(60));
    console.log('✅ GENERACIÓN COMPLETA');
    console.log('='.repeat(60));
    console.log(`Archivo generado: ${archivoDestino}`);
    console.log(`Pokémon insertados: ${habilidadesPorPokemon.size}/649`);
    console.log(`Habilidades únicas: ${habilidadesArray.length}`);
    console.log(`Movimientos únicos: ${movimientosArray.length}`);
    console.log(`Relaciones Pokémon-Habilidad: ${contadorRelacionesHabilidad}`);
    console.log(`Relaciones Pokémon-Movimiento: ${contadorRelacionesMovimiento}`);
    console.log(`Naturalezas predefinidas: ${naturalezas.length}`);
    
    console.log('\n📋 TABLAS RELLENADAS desde PokeAPI:');
    console.log('  1. pokemon (datos base)');
    console.log('  2. habilidades');
 
    console.log('  4. pokemon_puede_tener_habilidad');
    console.log('  5. pokemon_aprende_movimiento');
    console.log('  6. naturaleza (predefinidas)');
    
    console.log('\n⚠️  TABLAS NO RELLENADAS (elección del usuario):');
    console.log('  • usuarios');
    console.log('  • equipos');
    console.log('  • equipo_pokemon (con EVs, IVs)');
    console.log('  • pokemon_tiene_movimiento (movimientos de Pokémon en equipos)');
    console.log('='.repeat(60));
}

// Verificar que fetch está disponible
if (typeof fetch === 'undefined') {
    console.log('Error: Necesitas Node.js 18+ o instalar node-fetch');
    console.log('Solución: npm install node-fetch');
    console.log('Luego añade al inicio: const fetch = require("node-fetch");');
    process.exit(1);
}

// Ejecutar la función principal
console.log('🚀 Iniciando generación de datos Pokémon...');
console.log('⏳ Por favor, ten paciencia. Esto tomará 15-20 minutos.');

generarInsertsSQL().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});