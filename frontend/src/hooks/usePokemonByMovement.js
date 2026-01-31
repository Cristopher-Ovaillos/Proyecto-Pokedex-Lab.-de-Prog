import { useState, useCallback } from "react";
import api from "../api/apiclient";
import { ENDPOINTS } from "../config";

export default function usePokemonByMovement() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [movementId, setMovementId] = useState(null);

  const fetchPokemonsByMovement = useCallback(async (idMovimiento) => {
    if (!idMovimiento) return;

    setLoading(true);
    setError(null);
    setPage(1);
    setHasMore(true);
    setPokemons([]);
    setMovementId(idMovimiento);

    const queryParams = new URLSearchParams({
      page: 1,
      limit: 10,
    }).toString();

    try {
      const data = await api.get(
        `${ENDPOINTS.ENCICLOPEDIA.MOVIMIENTO_POKEMONS(idMovimiento)}?${queryParams}`
      );

      if (data?.data) {
        setPokemons(data.data);

        if (data.meta?.pagination) {
          setHasMore(
            data.meta.pagination.page < data.meta.pagination.totalPages
          );
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError("Error al cargar los Pokémon del movimiento.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNextPage = useCallback(async () => {
    if (loading || !hasMore || !movementId) return;

    setLoading(true);
    const nextPage = page + 1;

    const queryParams = new URLSearchParams({
      page: nextPage,
      limit: 20,
    }).toString();

    try {
      const data = await api.get(
        `${ENDPOINTS.ENCICLOPEDIA.MOVIMIENTO_POKEMONS(movementId)}?${queryParams}`
      );

      if (data?.data?.length > 0) {
        setPokemons((prev) => [...prev, ...data.data]);
        setPage(nextPage);

        if (data.meta?.pagination) {
          setHasMore(
            data.meta.pagination.page < data.meta.pagination.totalPages
          );
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError("Error al cargar más Pokémon.");
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, movementId]);

  return {
    pokemons,
    loading,
    error,
    hasMore,
    fetchPokemonsByMovement,
    fetchNextPage,
  };
}
