import {useState, useCallback} from 'react';
import apiclient from '../api/apiclient';
import { ENDPOINTS } from '../config';
import {useFocusEffect} from '@react-navigation/native'; //diferente a useEffect que solo se rennderiza uan unica vez, si bien cambiamos de pantalla... el use effect dentro del stack solo esta oculto.
//usar esto, permite que solo se renderize cuando para el usuario es visible.
import { useCurrentUser } from './useCurrentUser';


export const useTeam = () =>{
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {user} = useCurrentUser();

    const fetchTeams = useCallback(async()=>{
        if (!user) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await apiclient.get(ENDPOINTS.EQUIPOS.POR_USUARIO(user.id_usuario));
            setTeams(response.data || []);
        } catch (error) {
            setError('No se pudieron cargar los equipos.');
        }finally{
            setLoading(false);
        }


    },[user]);

    const createTeam = useCallback(async(teamName, pokemonIds)=>{
        if (!user) {
            throw new Error("Usuario no autenticado.");
        }
        setLoading(true);

        try {
            const response = await apiclient.post(
                ENDPOINTS.EQUIPOS.BASE,{
                    nombre: teamName,
                    pokemons: pokemonIds,
                }
            );
            await fetchTeams(); //recarga equipos despues de crear uno
            return response.data;

        } catch (error) {
            setError('Error al crear el equipo.')
            throw error;
        }finally{
            setLoading(false);
        }

    },[user, fetchTeams]);

    const deleteTeam = useCallback(async(teamId)=>{
        setLoading(true);
        try {
            await apiclient.delete(ENDPOINTS.EQUIPOS.DETALLE(teamId));
            setTeams(prev => prev.filter(team => team.id_equipo !== teamId));
        } catch (error) {
            setError('Error al eliminar equipo.');            
            throw error;
        }finally{
            setLoading(false);
        }

    },[]);

    useFocusEffect(
        useCallback(()=>{
            if (user) {
                fetchTeams();
            }
        },[user, fetchTeams]));

        return {teams, loading, error, createTeam, deleteTeam};
}
