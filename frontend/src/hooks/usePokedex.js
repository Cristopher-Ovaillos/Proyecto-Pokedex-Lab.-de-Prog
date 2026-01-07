import { useState, useCallback, useEffect } from "react";
import apiClient from "../api/apiclient";
import { ENDPOINTS } from "../config";
//esto ayuda a transformar los datos de la api
//la api devuelve un objeto plano, pero nuestros componentes esperan uno mas estructurado.

const transformarPokemonData = (pokemon) => {

    const types = [];
    if (pokemon.tipo_1) {
        types.push({ type: { name: pokemon.tipo_1 } });
    }
    if (pokemon.tipo_2) {
        types.push({ type: { name: pokemon.tipo_2 } });
    }

    //la api devolvera la imagen 
const imageUrl = pokemon.imagenUrl;
    return {
        id: pokemon.id_pokemon,
        name: pokemon.nombre,
        image: imageUrl,
        types: types,
    };

};





export function usePokedex() {
    const [pokemons, setPokemons] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadPokemons = useCallback(async (isInitialLoad = false) => {
        //con el fin de evitar cargar de mas si ya estamos en ello o si hemos llegado al final
        if (loading || (!isInitialLoad && page > totalPages)) { return; }

        setLoading(true);
        setError(null);
        // como siempre los trycatch seran utilizados para verificar la repsuesta de la api
        try {

            const currentPage = isInitialLoad ? 1 : page;
            const response = await apiClient.get(`${ENDPOINTS.ENCICLOPEDIA.POKEMONS}?page=${currentPage}&limit=20`);

            if (response && response.success) {
                const newPokemons = response.data.map(transformarPokemonData);
                //[viejo, nuevo] se fusionan / si es la carga incial, reemplazamos la lista de lo contrario añadimos los nuevos a la lista vieja.
                setPokemons(prev => isInitialLoad ? newPokemons : [...prev, ...newPokemons]);
                //guardamos el total de paginas desde la metadata que lo recibimos en la api
                setTotalPages(response.meta.pagination.totalPages);
                //preparamos la sigueinte pagina
                setPage(currentPage + 1);

            } else {
                throw new Error(response.message || "La respuesta de la API no fue exitosa.");
            }
        } catch (error) {
            console.error("Error al obtener los Pokémon:", err);
            setError("No se pudieron cargar los Pokémon.");
        } finally {
            //cuando se hace esto de loading siempre debeos setear
            setLoading(false);
        }

    }, [loading, page, totalPages]);//dependencias del hook

    //funcion para cargar la primera pagina.

    const refresh =()=>{
        setPage(1);
        loadPokemons(true);
    }
    return {pokemons, loading, error, loadPokemons, refresh};
}