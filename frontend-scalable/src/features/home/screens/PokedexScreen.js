import React, { useState, useCallback } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    ActivityIndicator, 
    RefreshControl, 
    TextInput, 
    TouchableOpacity 
} from 'react-native';
import usePokedex from '../../../hooks/usePokedex';
import PokemonCard from '../components/PokemonCard';
import PokemonDetailModal from '../components/PokemonDetailModal';
import FilterModal from '../components/FilterModal';
import styles from '../../../constants/styles';
import { COLORS } from '../../../constants/theme';

// se extrae la cabecera a su propio componente optimizado.
// 'react.memo' evita que este componente se vuelva a renderizar si sus props no cambian.
// esto soluciona el problema de que el teclado se cierre al escribir.
const ListHeader = React.memo(({ searchTerm, setSearchTerm, onFilterPress }) => {
    return (
        <View style={{ marginBottom: 10 }}>
            <Text className={styles.pokedex.title}>Pokédex</Text>
            
            <View className={styles.pokedex.searchContainer}>
                <TextInput
                    placeholder="Buscar por nombre..." // actualizado
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    className={styles.pokedex.searchInput}
                    placeholderTextColor="#9ca3af"
                />
            </View>

            <View className={styles.pokedex.filtersContainer}>
                 <TouchableOpacity 
                    onPress={onFilterPress} 
                    className={styles.pokedex.filterButton}
                >
                    <Text className={styles.pokedex.filterButtonText}>Filtros y Orden</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
});


export const PokedexScreen = () => {
    const { 
        pokemons, loading, error, loadMore, refresh,
        searchTerm, setSearchTerm,
        typeFilter, setTypeFilter,
        sort, setSort,
    } = usePokedex();

    const [selectedPokemonId, setSelectedPokemonId] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);

    const handleOpenModal = useCallback((pokemon) => {
        setSelectedPokemonId(pokemon.id);
    }, []);

    const handleCloseModal = () => setSelectedPokemonId(null);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        // la funcion refresh viene del hook y ya esta optimizada con usecallback.
        await refresh();
        setIsRefreshing(false);
    }, [refresh]);
    
    const handleApplyFilters = ({ type, sort: sortOrder }) => {
        setTypeFilter(type);
        setSort(sortOrder);
        setFilterModalVisible(false);
    };

    // componente que se muestra si la lista esta vacia.
    const renderEmptyList = () => {
        if (loading && pokemons.length === 0) {
            return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />;
        }
        if (!loading && pokemons.length === 0) {
            return (
                <View style={{ marginTop: 50, alignItems: 'center' }}>
                    <Text className={styles.pokedex.loadingText}>No se encontraron Pokémon.</Text>
                </View>
            );
        }
        return null;
    };

    return (
        <View className={styles.pokedex.container} style={{ flex: 1 }}>
            <PokemonDetailModal 
                pokemonId={selectedPokemonId} 
                visible={!!selectedPokemonId} 
                onClose={handleCloseModal} 
            />
            
            <FilterModal 
                visible={filterModalVisible}
                onClose={() => setFilterModalVisible(false)}
                currentType={typeFilter}
                currentSort={sort}
                onApply={handleApplyFilters}
            />

            <FlatList
                // el keyboardshouldpersisttaps ayuda a que el teclado no se cierre abruptamente.
                keyboardShouldPersistTaps="handled"
                data={pokemons}
                renderItem={({ item }) => (
                    <PokemonCard 
                        pokemon={item} 
                        onPress={() => handleOpenModal(item)} 
                    />
                )}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                numColumns={2}
                ListHeaderComponent={
                    <ListHeader 
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        onFilterPress={() => setFilterModalVisible(true)}
                    />
                }
                ListEmptyComponent={renderEmptyList}
                ListFooterComponent={() => (
                    loading && pokemons.length > 0 ? (
                        <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 20 }} />
                    ) : null
                )}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        colors={[COLORS.primary]}
                    />
                }
                columnWrapperStyle={{ justifyContent: 'space-between' }}
            />
        </View>
    );
};

export default PokedexScreen;