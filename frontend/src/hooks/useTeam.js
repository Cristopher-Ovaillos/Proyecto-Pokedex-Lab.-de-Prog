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
        console.log('useteam: fetching teams...'); // obteniendo equipos
        if (!user) {
            console.log('useteam: user not authenticated, skipping fetchTeams.'); // usuario no autenticado, saltando fetchteams
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await apiclient.get(ENDPOINTS.EQUIPOS.POR_USUARIO(user.id_usuario));
            setTeams(response.data || []);
            console.log('useteam: teams fetched successfully:', response.data); // equipos obtenidos con exito
        } catch (error) {
            setError('no se pudieron cargar los equipos.');
            console.log('useteam: error fetching teams:', error); // error al obtener equipos
        }finally{
            setLoading(false);
            console.log('useteam: fetchteams loading set to false'); // carga de fetchteams en falso
        }


    },[user]);

    const createTeam = useCallback(async(teamName, pokemonIds)=>{
        console.log('useteam: creating team:', teamName, 'with pokemons:', pokemonIds); // creando equipo
        if (!user) {
            console.log('useteam: user not authenticated, cannot create team.'); // usuario no autenticado, no se puede crear equipo
            throw new Error("usuario no autenticado.");
        }
        setLoading(true);

        try {
            const response = await apiclient.post(
                ENDPOINTS.EQUIPOS.BASE,{
                    nombre: teamName,
                    pokemons: pokemonIds,
                }
            );
            console.log('useteam: team created successfully:', response.data); // equipo creado con exito
            await fetchTeams(); //recarga equipos despues de crear uno
            return response.data;

        } catch (error) {
            setError('error al crear el equipo.')
            console.log('useteam: error creating team:', error); // error al crear equipo
            throw error;
        }finally{
            setLoading(false);
            console.log('useteam: createteam loading set to false'); // carga de createteam en falso
        }

    },[user, fetchTeams]);

    const deleteTeam = useCallback(async(teamId)=>{
        console.log('useteam: deleting team with id:', teamId); // eliminando equipo
        setLoading(true);
        try {
            await apiclient.delete(ENDPOINTS.EQUIPOS.DETALLE(teamId));
            setTeams(prev => prev.filter(team => team.id_equipo !== teamId));
            console.log('useteam: team deleted successfully:', teamId); // equipo eliminado con exito
        } catch (error) {
            setError('error al eliminar equipo.');            
            console.log('useteam: error deleting team:', error); // error al eliminar equipo
            throw error;
        }finally{
            setLoading(false);
            console.log('useteam: deleteteam loading set to false'); // carga de deleteteam en falso
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
