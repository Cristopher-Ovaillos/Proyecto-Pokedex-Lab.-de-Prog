import { useState, useCallback } from "react";
import api from "../api/apiclient";
import { ENDPOINTS } from "../config";

export default function useMovements() {
 
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const searchMovements = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        setPage(1);
        setMovements([]);
        setHasMore(true);

        const queryParams = new URLSearchParams({ page: 1, limit: 20, ...params }).toString();
        console.log(`${ENDPOINTS.ENCICLOPEDIA.MOVIMIENTOS}?${queryParams}`)

        try {
            const data = await api.get(`${ENDPOINTS.ENCICLOPEDIA.MOVIMIENTOS}?${queryParams}`);
            console.log(data);
            if (data && data.data) {
                setMovements(data.data); 
                if (data.meta?.pagination) {
                    setHasMore(data.meta.pagination.page < data.meta.pagination.totalPages);
                } else {
                    setHasMore(false);
                }  
            } else {
                setHasMore(false);
            }    
            
        } catch (error) {
            setError("Error al buscar movimientos.");
        } finally {
            setLoading(false);
        }
    }, [])

    const fetchNextPage = useCallback(async (params = {}) => {
        if (loading || !hasMore) return;    

        setLoading(true);
        const nextPage = page + 1;
        const queryParams = new URLSearchParams({ page: nextPage, limit: 20, ...params }).toString();

        try {
            const data = await api.get(`${ENDPOINTS.ENCICLOPEDIA.MOVIMIENTOS}?${queryParams}`);
            console.log(data);
            if (data && data.data?.length > 0) {
                setMovements((prev) => [...prev, ...data.data]); 
                setPage(nextPage);
                if (data.meta?.pagination) {
                    setHasMore(data.meta.pagination.page < data.meta.pagination.totalPages);
                } else {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }   
        } catch (error) {
            setError("Error al cargar más movimientos.");
        } finally {
            setLoading(false);
        }

    }, [page, loading, hasMore]);


    return { movements, loading, error, hasMore, searchMovements, fetchNextPage
    };
}