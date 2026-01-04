// este archivo contiene funciones de utilidad relacionadas con los pokemon.
// su proposito es centralizar la logica de transformacion de datos.

// esta funcion toma un objeto 'pokemon' tal como viene de la api
// y lo transforma a la estructura que los componentes de la app esperan.
// esto es util porque la api puede tener inconsistencias entre diferentes endpoints (lista vs detalle).
export const formatPokemonData = (p) => {
    // si no hay datos, retorna null para evitar errores.
    if (!p) {
        return null;
    }

    // la api de lista usa 'id_pokemon', la de detalle usa 'id'.
    // esta linea detecta cual de los dos es para saber como procesar el resto de los datos.
    const isListItem = p.id_pokemon !== undefined;

    // la api de lista devuelve 'tipo_1' y 'tipo_2', la de detalle devuelve un array 'tipos'.
    // aqui se unifica para que la salida siempre sea un array 'types' con la misma estructura.
    const types = isListItem 
        ? [p.tipo_1 && { type: { name: p.tipo_1 } }, p.tipo_2 && { type: { name: p.tipo_2 } }].filter(Boolean)
        : (p.tipos || []).map(t => ({ type: { name: t } }));

    // lo mismo para las estadisticas. la api de lista las tiene en la raiz del objeto,
    // la de detalle las tiene dentro de un objeto 'estadisticas'.
    const statsSource = isListItem ? p : p.estadisticas;
    const stats = statsSource ? [
        { base_stat: statsSource.hp_base, stat: { name: 'hp' } },
        { base_stat: statsSource.ataque_base, stat: { name: 'attack' } },
        { base_stat: statsSource.defensa_base, stat: { name: 'defense' } },
        { base_stat: statsSource.ataque_especial_base, stat: { name: 'special-attack' } },
        { base_stat: statsSource.defensa_especial_base, stat: { name: 'special-defense' } },
        { base_stat: statsSource.velocidad_base, stat: { name: 'speed' } },
    ].filter(s => s.base_stat !== undefined && s.base_stat !== null) : [];
    
    // la url de la imagen a veces viene sin 'http://', aqui se lo anadimos si es necesario.
    const imageUrl = p.imagenUrl && !p.imagenUrl.startsWith('http') 
        ? `http://${p.imagenUrl}` 
        : p.imagenUrl;

    // finalmente, se retorna un nuevo objeto con una estructura consistente y predecible
    // que los componentes como 'pokemoncard' y 'pokemondetailmodal' pueden usar sin problemas.
    return {
        id: p.id_pokemon || p.id,
        name: p.nombre,
        types: types,
        sprites: {
            front_default: imageUrl,
        },
        stats: stats,
        abilities: isListItem ? [] : (p.habilidades || []),
        height: p.altura,
        weight: p.peso,
    };
};
