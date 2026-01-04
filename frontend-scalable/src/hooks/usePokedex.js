// importa los hooks necesarios de react.
import { useState, useEffect, useCallback } from 'react';
// importa el cliente de api y los endpoints de configuracion.
import api from '../api/apiclient';
import { ENDPOINTS } from '../config';
// importa la funcion que transforma los datos de la api.
import { formatPokemonData } from '../utils/pokemonUtils';

// este es un custom hook para el debounce.
// su funcion es esperar a que el usuario deje de escribir para lanzar la busqueda.
// esto evita que se hagan llamadas a la api con cada letra que se escribe.
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // crea un temporizador que actualiza el valor despues del 'delay'.
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // limpia el temporizador si el valor cambia antes de que se cumpla el 'delay'.
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// este es el hook principal que maneja toda la logica de la pokedex.
// un hook es como una funcion reutilizable que puede tener su propio estado.
export default function usePokedex() {
    // ---- estados del hook ----
    // 'pokemons' es el array que guarda la lista de pokemons a mostrar.
    const [pokemons, setPokemons] = useState([]);
    // 'page' controla la pagina actual para la paginacion (scroll infinito).
    const [page, setPage] = useState(1);
    // 'hasmore' indica si quedan mas pokemons por cargar en la api.
    const [hasMore, setHasMore] = useState(true);
    // 'loading' se usa para mostrar un indicador de carga mientras se buscan datos.
    const [loading, setLoading] = useState(false);
    // 'error' guarda cualquier error que ocurra durante la busqueda.
    const [error, setError] = useState(null);

    // ---- estados para los filtros ----
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [sort, setSort] = useState({ by: 'id', orden: 'asc' });
    // aplica el debounce al termino de busqueda.
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // ---- efectos ----
    // este efecto se dispara cuando cambia cualquier filtro.
    // su unica funcion es resetear la pagina a 1 para empezar una nueva busqueda.
    useEffect(() => {
        setPage(1);
    }, [debouncedSearchTerm, typeFilter, sort]);

    // este es el efecto principal que busca los pokemons en la api.
    // se dispara cuando la pagina o los filtros cambian.
    useEffect(() => {
        const fetchPokemons = async () => {
            setLoading(true);
            setError(null);

            try {
                // construye los parametros para la url.
                const params = new URLSearchParams({ page: String(page), limit: '20' });
                if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
                if (typeFilter) params.append('type', typeFilter);
                params.append('sort', sort.by);
                params.append('order', sort.orden);
                
                const url = `${ENDPOINTS.ENCICLOPEDIA.POKEMONS}?${params.toString()}`;
                
                const response = await api.get(url);

                if (response.success && Array.isArray(response.data)) {
                    // formatea los datos de la api a la estructura que usan los componentes.
                    const formattedData = response.data.map(formatPokemonData);
                    
                    // si es la pagina 1, reemplaza la lista. si no, anade los nuevos resultados.
                    if (page === 1) {
                        setPokemons(formattedData);
                    } else {
                        setPokemons(prev => [...prev, ...formattedData]);
                    }
                    
                    // si la api devuelve menos de 20, significa que no hay mas paginas.
                    setHasMore(response.data.length === 20);
                } else {
                    setHasMore(false);
                    if (page === 1) {
                        setPokemons([]);
                    }
                }
            } catch (err) {
                setError(err);
                setPokemons([]); // limpia la lista si hay un error.
            } finally {
                setLoading(false); // asegura que el loading siempre se detenga.
            }
        };

        fetchPokemons();
    }, [page, debouncedSearchTerm, typeFilter, sort]); // dependencias del efecto.

    // ---- funciones exportadas ----
    // funcion para cargar mas pokemons, llamada por el onendreached de la flatlist.
    const loadMore = useCallback(() => {
        // solo si hay mas paginas y no esta cargando actualmente.
        if (hasMore && !loading) {
            setPage(prevPage => prevPage + 1);
        }
    }, [hasMore, loading]);

    // funcion para el 'pull-to-refresh'. resetea todos los filtros.
    const refresh = useCallback(() => {
        setSearchTerm('');
        setTypeFilter('');
        setSort({ by: 'id', orden: 'asc' });
        // al resetear los filtros, el primer useeffect se dispara y resetea la pagina a 1.
    }, []);

    // el hook retorna todos los estados y funciones que el componente 'pokedexscreen' necesita.
    return {
        pokemons, loading, error, loadMore, refresh,
        searchTerm, setSearchTerm, typeFilter, setTypeFilter, sort, setSort,
    };
}
