console.log("ingestar bd");
const urlPokedex = 'https://pokeapi.co/api/v2/pokemon/'
//hacer fetch: https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch#:~:text=Una%20petici%C3%B3n%20b%C3%A1sica%20de%20fetch,recursos%20que%20se%20han%20devuelto. 
const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });

// llama a la funcion con la url
fetch(urlPokedex)
    //inicialmente trae el objeto con sus metadatos.
    // traduce la respuesta a un objeto que JS entienda, osea json.
    //function(res) {
    //  return res.json();
    //  }
    // esta es la equivalencia de => (Si la funcion tiene una sola línea, el return es automatico )
    .then(res => res.json()) // con .json(), estamos pidiendo que se extraiga el contenido
    // usar los datos
    .then(data => console.log(data.results));// Recibe lo que devolvio el primer .then. Aqui data ya es el objeto de JavaScript listo para usar. 


    const fs = require('fs');
    // https://nodejs.org/api/fs.html#fswritefilesyncfile-data-options
    async function generarInsertsSQL() {
        const totalPokemon = 649; // 649 pokemon hasta la quinta generacion
        const archivoDestino = 'insert_pokemon.sql';
        // Limpiar o crear el archivo al inicio fs.writeFileSync(archivo, datos, opciones); 
        fs.writeFileSync('archivo.txt', '', { flag: 'w' });
        let i;
         for (i = 1; i <= totalPokemon; i++) {
            try {
                //await le dice a JavaScript: Detente aquí y no pases a la siguiente línea hasta que el servidor conteste.
                //Lo que se guarda en la variable respuesta no son los datos del Pokémon todavía; es un "paquete" que contiene el estado de la conexión (si fue exitosa, el código 200, las cabeceras, etc.). El cuerpo del mensaje aún está en formato binario (crudo).
                const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
                //Convierte ese texto plano con formato JSON en un Objeto de JavaScript que puedes manipular (usar puntos para acceder a propiedades, como data.name
                //Se usa await nuevamente porque la conversión de un texto muy largo a un objeto también toma un tiempo mínimo de procesamiento y es una tarea asíncrona.
                const data = await respuesta.json();
    
                // Extraer datos según tu estructura de tabla pokemon
                const id = data.id;
                const nombre = data.name;
                const tipo_1 = data.types[0].type.name;
                const tipo_2 = data.types[1] ? data.types[1].type.name : 'NULL';
                
                // Stats base
                const hp = data.stats[0].base_stat;
                const ataque = data.stats[1].base_stat;
                const defensa = data.stats[2].base_stat;
                const at_especial = data.stats[3].base_stat;
                const def_especial = data.stats[4].base_stat;
                const velocidad = data.stats[5].base_stat;
    
                // Construcción del INSERT SQL ajustado a tu comentario
                const sql = `INSERT INTO pokemon (id_pokemon, nombre, tipo_1, tipo_2, hp_base, ataque_base, ataque_especial_base, defensa_base, defensa_especial_base, velocidad_base) VALUES (${id}, '${nombre}', '${tipo_1}', ${tipo_2 === 'NULL' ? 'NULL' : `'${tipo_2}'`}, ${hp}, ${ataque}, ${at_especial}, ${defensa}, ${def_especial}, ${velocidad});\n`;
    
                // Guardar en el archivo
                fs.appendFileSync(archivoDestino, sql);
                
                if (i % 50 === 0) console.log(`Progreso: ${i}/${totalPokemon} cargados...`);
    
            } catch (error) {
                console.error(`Error obteniendo al Pokemon ID ${i}:`, error.message);
            }
        }
        console.log("FIN-INSERTS");
    }
    
    generarInsertsSQL();
    
    
