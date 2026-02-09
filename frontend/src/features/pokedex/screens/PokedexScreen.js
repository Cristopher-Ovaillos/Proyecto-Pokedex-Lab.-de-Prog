import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { debounce } from 'lodash';

import usePokedex from '../../../hooks/usePokedex';
import { PokemonCard } from '../components/PokemonCard';
import { PokemonDetailModal } from '../components/PokemonDetailModal';
import styles from '../../../constants/styles';

export const PokedexScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    console.log('pokedexscreen: route.params en carga:', route.params); // diagnostico de parametros de ruta
    
    const { pokemons, loading, error, searchPokemons, fetchNextPage, hasMore } = usePokedex();
    const [searchTerm, setSearchTerm] = useState('');
    
    // State para el modal
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPokemonId, setSelectedPokemonId] = useState(null);

    // Carga inicial de Pokémon
    useEffect(() => {
        searchPokemons();
    }, []);
    
    // Búsqueda con "debounce"
    const debouncedSearch = useCallback(debounce((term) => {
        searchPokemons({ search: term });
    }, 500), [searchPokemons]);

    useEffect(() => {
        debouncedSearch(searchTerm);
    }, [searchTerm, debouncedSearch]);

    // Maneja el clic en una carta
    const handlePressCard = useCallback((pokemon) => {
        if (route.params?.isSelecting) {
            // si venimos de "crear equipo", volvemos con el pokemon seleccionado
            // importante: pasamos el objeto pokemon completo
            navigation.navigate('Crear Equipo', {
                selectedPokemon: pokemon,
                slotIndex: route.params?.slotIndex // se añade un encadenamiento opcional para slotIndex
            });
        } else {
            // comportamiento normal: ver detalles
            // aqui obtenemos el id del objeto pokemon
            setSelectedPokemonId(pokemon.id_pokemon);
            setModalVisible(true);
        }
    }, [route.params?.isSelecting, navigation, route.params?.slotIndex, setSelectedPokemonId, setModalVisible]);

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedPokemonId(null);
    }

    const renderFooter = () => {
        if (loading && pokemons.length > 0) {
            return <ActivityIndicator size="large" style={{ marginVertical: 20 }} color="#3B82F6"/>;
        }
        return null;
    };

    const renderItem = useCallback(({ item }) => (
        <PokemonCard 
            pokemon={item} 
            // importante: pasamos 'item' (el objeto pokemon completo)
            onPress={() => handlePressCard(item)}
        />
    ), [handlePressCard]);

    return (
        <View className={styles.layout.screen} style={{backgroundColor: '#1E293B'}}>
            <Text className={styles.ui.titleMain} style={{color: 'white'}}>Enciclopedia</Text>
            
            <TextInput
                className={styles.ui.input}
                placeholder="Buscar por nombre o número..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholderTextColor="#9CA3AF"
                style={{backgroundColor: '#374151', color: 'white', borderColor: '#4B5563'}}
            />

            {(loading && pokemons.length === 0) ? (
                 <ActivityIndicator size="large" color="#3B82F6" style={{flex: 1}}/>
            ) : error ? (
                <Text style={{...styles.ui.error, color: '#F87171'}}>{error}</Text>
            ) : (
                <FlatList
                    data={pokemons}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id_pokemon.toString()}
                    numColumns={2}
                    contentContainerStyle={{paddingHorizontal: 5}}
                    onEndReached={() => {
                        if (hasMore) { // siempre permitir buscar la siguiente pagina si hay mas
                            fetchNextPage(searchTerm ? { search: searchTerm } : {}); // pasa el termino de busqueda actual
                        }
                    }}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={() => (
                        !loading && <Text style={{...styles.ui.label, color: 'white', textAlign: 'center'}}>No se encontraron Pokémon.</Text>
                    )}
                />
            )}
            
            {selectedPokemonId && (
                <PokemonDetailModal 
                    visible={modalVisible}
                    onClose={handleCloseModal}
                    pokemonId={selectedPokemonId}
                />
            )}
        </View>
    );
};