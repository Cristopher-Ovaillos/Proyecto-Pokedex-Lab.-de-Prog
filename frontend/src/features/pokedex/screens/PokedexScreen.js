import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, ActivityIndicator } from 'react-native';
import usePokedex from '../../../hooks/usePokedex';
import { PokemonCard } from '../components/PokemonCard';
import { PokemonDetailModal } from '../components/PokemonDetailModal';
import styles from '../../../constants/styles';
import { debounce } from 'lodash';

export const PokedexScreen = () => {
    const { pokemons, loading, error, searchPokemons, fetchNextPage, hasMore } = usePokedex();
    const [searchTerm, setSearchTerm] = useState('');
    
    // State para el modal
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPokemonId, setSelectedPokemonId] = useState(null);

    // Carga inicial de Pokémon
    useEffect(() => {
        searchPokemons();
    }, []);
    
    // Búsqueda con "debounce" para no llamar a la API en cada letra que escribes
    const debouncedSearch = useCallback(debounce((term) => {
        searchPokemons({ search: term });
    }, 500), [searchPokemons]);

    useEffect(() => {
        debouncedSearch(searchTerm);
    }, [searchTerm, debouncedSearch]);

    // Abre el modal con el ID del pokémon seleccionado
    const handlePressCard = (pokemonId) => {
        setSelectedPokemonId(pokemonId);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedPokemonId(null);
    }

    const renderFooter = () => {
        // Muestra el spinner solo si está cargando más páginas (no en la búsqueda inicial)
        if (loading && pokemons.length > 0) {
            return <ActivityIndicator size="large" style={{ marginVertical: 20 }} color="#3B82F6"/>;
        }
        return null;
    };

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
                    renderItem={({ item }) => (
                        <PokemonCard 
                            pokemon={item} 
                            onPress={() => handlePressCard(item.id_pokemon)}
                        />
                    )}
                    keyExtractor={(item) => item.id_pokemon.toString()}
                    numColumns={2}
                    contentContainerStyle={{paddingHorizontal: 5}}
                    onEndReached={() => {
                        if (hasMore && !searchTerm) {
                            fetchNextPage();
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
