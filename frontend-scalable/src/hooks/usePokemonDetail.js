import { useState, useEffect } from 'react';
import api from '../api/apiclient';
import { ENDPOINTS } from '../config';
import { formatPokemonData } from '../utils/pokemonUtils';

export default function usePokemonDetail(pokemonId) {
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Only fetch if there is a pokemonId
        if (!pokemonId) {
            setPokemon(null);
            return;
        }

        const fetchDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const url = ENDPOINTS.ENCICLOPEDIA.POKEMON_DETAIL(pokemonId);
                const response = await api.get(url);

                if (response.success && response.data) {
                    // API might return a single object or an array with one object
                    const pokemonData = Array.isArray(response.data) ? response.data[0] : response.data;
                    setPokemon(formatPokemonData(pokemonData));
                } else {
                    setError('No se pudieron cargar los detalles del Pokémon.');
                    setPokemon(null);
                }
            } catch (err) {
                setError('Ocurrió un error al buscar el Pokémon.');
                console.error(err);
                setPokemon(null);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();

    }, [pokemonId]); // This effect runs whenever pokemonId changes

    return { pokemon, loading, error };
}
