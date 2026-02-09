import { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator, Image } from 'react-native';
import { toast } from 'sonner-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styles from '../../constants/styles';
import { useTeam } from '../../hooks/useTeam';
import PokemonSlot from './components/PokemonSlot';
import MoveSelectionModal from './components/MoveSelectionModal';
//hooks {} y coponents usar default

const TeamCard = ({ team, onDelete }) => (

  <View className={styles.teamBuilder.teamCard}>
    <View className={styles.teamBuilder.teamCardHeader}>
      <Text className={styles.teamBuilder.teamCardName}>{team.nombre_equipo}</Text>
      <TouchableOpacity onPress={() => onDelete(team.id_equipo)}>
        <Text className={"text-red-500 font-pixel text-lg"}>X</Text>
      </TouchableOpacity>
    </View>

    <Text className={styles.teamBuilder.teamCardDate}>
      {new Date(team.fecha_creacion).toLocaleDateString()}
    </Text>

    <View className={styles.teamBuilder.teamCardPokemons}>
      {
        team.pokemons?.slice(0, 6).map((p, index) => (
          <Image key={index} source={{ uri: p.imagenUrl }} className={styles.teamBuilder.teamCardPokemonImage} />
        ))
      }
    </View>
  </View>
);
//ver si es =>{} o =>()

export const CrearEquipoScreen = ({ route }) => {
  const navigation = useNavigation();
  const { teams, loading, error, createTeam, deleteTeam } = useTeam();

  const [teamName, setTeamName] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(Array(6).fill(null));

  const onPokemonSelected = useCallback((pokemon) => {
    const { slotIndex } = route.params || {};
    if (slotIndex === undefined || slotIndex === null) { // tambien comprobar si es null
      return;
    }

    if (selectedPokemon.some(p => p && p.id_pokemon === pokemon.id_pokemon)) {
      toast.info('Pokemon duplicado', { description: 'Este pokemon ya esta en tu equipo' });
      return;
    }

    const newTeam = [...selectedPokemon];
    newTeam[slotIndex] = { ...pokemon, movimientos: [] }; // Inicializar movimientos vacíos
    setSelectedPokemon(newTeam);

  }, [route.params, selectedPokemon]);

  const [moveModalVisible, setMoveModalVisible] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState(null);

  const openMoveSelection = (index) => {
    setActiveSlotIndex(index);
    setMoveModalVisible(true);
  };

  const handleMovesSelected = (moves) => {
    const newTeam = [...selectedPokemon];
    if (activeSlotIndex !== null && newTeam[activeSlotIndex]) {
      newTeam[activeSlotIndex] = { ...newTeam[activeSlotIndex], movimientos: moves };
      setSelectedPokemon(newTeam);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (route.params?.selectedPokemon) {
        onPokemonSelected(route.params.selectedPokemon);
        navigation.setParams({ selectedPokemon: null, slotIndex: null });
      }
    }, [route.params, onPokemonSelected])
  );

  const navigateToPokedex = (slotIndex) => {
    navigation.navigate('Pokedex', { isSelecting: true, slotIndex })
  };

  const handleSaveTeam = async () => {
    const filledSlots = selectedPokemon.filter(p => p != null);
    if (!teamName.trim()) {
      return toast.error('Falta Nombre', { description: 'Por favor, dale un nombre a tu equipo.' });
    }
    if (filledSlots.length === 0) {
      return toast.error('Equipo Vacio', { description: 'Debes agregar agregar al menos un Pokemon.' });
    }

    const pokemonsPayload = filledSlots.map(p => ({
      id_pokemon: p.id_pokemon,
      id_naturaleza: 1, // Default por ahora
      id_habilidad: 1, // Default por ahora
      movimientos: p.movimientos ? p.movimientos.map(m => m.id_movimiento) : []
    }));

    try {
      await createTeam(teamName, pokemonsPayload);
      setTeamName('');
      setSelectedPokemon(Array(6).fill(null));
      toast.success('¡Éxito!', { description: 'Equipo guardado correctamente.' });
    } catch (error) {
      toast.error('Error', { description: 'No se pudo guardar el equipo.' });
    }

  };

  const handleDeleteTeam = (teamId) => {
    Alert.alert(
      "Confirmar",
      "¿Seguro que quieres eliminar este equipo?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => deleteTeam(teamId) },
      ]
    );
  };

  return (
    <>
      <FlatList
        className={styles.layout.screen}
        style={{ backgroundColor: '#1E293B' }}
        ListHeaderComponent={
          <>
            <Text className={styles.ui.titleMain}>Crea tu Equipo</Text>
            <TextInput
              className={styles.ui.input}
              placeholder="Nombre del Equipo"
              value={teamName}
              onChangeText={setTeamName}
              placeholderTextColor="#9CA3AF"
              style={{ backgroundColor: '#374151', color: 'white', borderColor: '#4B5563' }}
            />

            <View className={styles.teamBuilder.slotContainer}>
              {selectedPokemon.map((p, i) => (
                <PokemonSlot
                  key={i}
                  pokemon={p}
                  onSelect={() => navigateToPokedex(i)}
                  onEditMoves={() => openMoveSelection(i)}
                />
              ))}
            </View>

            <TouchableOpacity className={styles.ui.btnPrimary} onPress={handleSaveTeam} disabled={loading} >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (<Text className={styles.ui.btnText}>Guardar Equipo</Text>)}
            </TouchableOpacity>

            <Text className={`${styles.ui.titleSection} mt-8 mb-4`}>Mis equipos</Text>
            {loading && teams.length === 0 && <ActivityIndicator size="large" color="#3B82F6" />}
            {error && !loading && <Text className={styles.ui.error}>{error}</Text>}
          </>
        }
        data={teams}
        renderItem={({ item }) => <TeamCard team={item} onDelete={handleDeleteTeam} />}
        keyExtractor={(item) => item.id_equipo.toString()}
        ListEmptyComponent={() => (
          !loading && !error && <Text className={`${styles.ui.label} text-center`} style={{ color: 'white' }}>No has creado ningún equipo.</Text>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {moveModalVisible && activeSlotIndex !== null && selectedPokemon[activeSlotIndex] && (
        <MoveSelectionModal
          visible={moveModalVisible}
          onClose={() => setMoveModalVisible(false)}
          pokemonId={selectedPokemon[activeSlotIndex].id_pokemon}
          currentMoves={selectedPokemon[activeSlotIndex].movimientos}
          onSelectMoves={handleMovesSelected}
        />
      )}
    </>
  );
}


