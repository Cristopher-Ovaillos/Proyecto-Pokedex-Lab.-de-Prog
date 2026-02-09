import { useState, useCallback } from 'react';
import api from '../api/apiclient';
import { ENDPOINTS } from '../config';

export default function usePokedex() {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const searchPokemons = useCallback(async (params = {}) => {
        console.log('usepokedex: searching pokemons with params:', params); // parametros de busqueda
        setLoading(true);
        setError(null);
        setPage(1);
        setPokemons([]);
        setHasMore(true);

        const queryParams = new URLSearchParams({ page: 1, limit: 20, ...params }).toString();
        try {
            const data = await api.get(`${ENDPOINTS.ENCICLOPEDIA.POKEMONS}?${queryParams}`);
            console.log('usepokedex: search pokemons api response:', data); // respuesta de api de busqueda
            if (data && data.data) {
                setPokemons(data.data);
                console.log('usepokedex: pokemons set:', data.data.length, 'items'); // pokemones establecidos
                if (data.meta?.pagination) {
                    setHasMore(data.meta.pagination.page < data.meta.pagination.totalPages);
                    console.log('usepokedex: hasmore set to:', data.meta.pagination.page < data.meta.pagination.totalPages); // tiene mas paginas
                } else {
                    setHasMore(false);
                    console.log('usepokedex: hasmore set to false (no pagination meta)'); // no hay mas paginas (sin meta de paginacion)
                }
            } else {
                setHasMore(false);
                console.log('usepokedex: hasmore set to false (no data)'); // no hay mas paginas (sin datos)
            }
        } catch (error) {
            setError('Error al buscar Pokémon.');
            console.log('usepokedex: error searching pokemons:', error); // error al buscar pokemones
        } finally {
            setLoading(false);
            console.log('usepokedex: search loading set to false'); // carga de busqueda en falso
        }
    }, []);

    const fetchNextPage = useCallback(async (params = {}) => {
        if (loading || !hasMore) {
            console.log('usepokedex: skipping fetchNextPage, loading:', loading, 'hasmore:', hasMore); // saltando la siguiente pagina
            return;
        }

        console.log('usepokedex: fetching next page with params:', params, 'current page:', page); // obteniendo siguiente pagina
        setLoading(true);
        const nextPage = page + 1;
        const queryParams = new URLSearchParams({ page: nextPage, limit: 20, ...params }).toString();

        try {
            const data = await api.get(`${ENDPOINTS.ENCICLOPEDIA.POKEMONS}?${queryParams}`);
            console.log('usepokedex: fetch next page api response:', data); // respuesta de api de siguiente pagina
            if (data && data.data?.length > 0) {
                setPokemons((prev) => [...prev, ...data.data]);
                console.log('usepokedex: pokemons appended, total:', [...pokemons, ...data.data].length); // pokemones agregados
                setPage(nextPage);
                console.log('usepokedex: page incremented to:', nextPage); // pagina incrementada
                if (data.meta?.pagination) {
                    setHasMore(data.meta.pagination.page < data.meta.pagination.totalPages);
                    console.log('usepokedex: hasmore set to:', data.meta.pagination.page < data.meta.pagination.totalPages); // tiene mas paginas
                } else {
                    setHasMore(false);
                    console.log('usepokedex: hasmore set to false (no pagination meta)'); // no hay mas paginas (sin meta de paginacion)
                }
            } else {
                setHasMore(false);
                console.log('usepokedex: hasmore set to false (no more data or empty)'); // no hay mas paginas (sin mas datos o vacio)
            }
        } catch (error) {
            setError('Error al cargar más Pokémon.');
            console.log('usepokedex: error fetching next page:', error); // error al obtener siguiente pagina
        } finally {
            setLoading(false);
            console.log('usepokedex: fetch next page loading set to false'); // carga de siguiente pagina en falso
        }
    }, [page, loading, hasMore]);

    return { pokemons, loading, error, searchPokemons, fetchNextPage, hasMore };
}
