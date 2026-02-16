import { useState, useCallback } from "react";
import api from "../api/apiclient";
import { ENDPOINTS } from "../config";

const LIMIT = 10;

export default function usePokemonByMovement() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [movementId, setMovementId] = useState(null);

  const fetchPokemonsByMovement = useCallback(async (idMovimiento) => {
    if (idMovimiento == null) return;

    setLoading(true);
    setError(null);
    setPage(1);
    setHasMore(true);
    setPokemons([]);
    setMovementId(idMovimiento);

    try {
      const data = await api.get(
        `${ENDPOINTS.ENCICLOPEDIA.MOVIMIENTO_POKEMONS(
          idMovimiento
        )}?page=1&limit=${LIMIT}`
      );

      console.log("Respuesta inicial:", data);

      if (data?.data?.length > 0) {
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
      console.error("Error fetch inicial:", err);
      setError("Error al cargar los Pokémon del movimiento.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNextPage = useCallback(async () => {
    if (loading || !hasMore || movementId == null) return;

    setLoading(true);
    const nextPage = page + 1;

    try {
      const data = await api.get(
        `${ENDPOINTS.ENCICLOPEDIA.MOVIMIENTO_POKEMONS(
          movementId
        )}?page=${nextPage}&limit=${LIMIT}`
      );

      console.log("Respuesta next page:", data);

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
      console.error("Error fetch next:", err);
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
