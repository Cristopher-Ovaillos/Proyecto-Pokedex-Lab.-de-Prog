import { useState, useCallback } from "react";
import api from "../api/apiclient";
import { ENDPOINTS } from "../config";

export default function useMovements() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({});

  const searchMovements = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    setPage(1);
    setMovements([]);
    setHasMore(true);
    setFilters(params);

    const queryParams = new URLSearchParams({
      page: 1,
      limit: 20,
      ...params,
    }).toString();

    try {
      const res = await api.get(
        `${ENDPOINTS.ENCICLOPEDIA.MOVIMIENTOS}?${queryParams}`
      );

      if (res?.data) {
        setMovements(Array.isArray(res.data) ? res.data : []);
        if (res.meta?.pagination) {
          setHasMore(
            res.meta.pagination.page < res.meta.pagination.totalPages
          );
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (e) {
      setError("Error al buscar movimientos.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNextPage = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = page + 1;

    const queryParams = new URLSearchParams({
      page: nextPage,
      limit: 20,
      ...filters,
    }).toString();

    try {
      const res = await api.get(
        `${ENDPOINTS.ENCICLOPEDIA.MOVIMIENTOS}?${queryParams}`
      );

      if (res?.data?.length > 0) {
        setMovements((prev) => [...prev, ...(Array.isArray(res.data) ? res.data : [])]);
        setPage(nextPage);

        if (res.meta?.pagination) {
          setHasMore(
            res.meta.pagination.page < res.meta.pagination.totalPages
          );
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (e) {
      setError("Error al cargar más movimientos.");
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, filters]);

  return {
    movements,
    loading,
    error,
    hasMore,
    searchMovements,
    fetchNextPage,
  };
}