import React, { useEffect } from 'react';
import { FlatList, ActivityIndicator, View } from 'react-native';
import { usePokedex } from '../../../hooks/usePokedex';
import PokemonCard from './PokemonCard';
import styles from '../../../constants/styles';

const PokemonList = () => {
    const { pokemons, loading, refresh, loadPokemons } = usePokedex();

    useEffect(() => {
        refresh();
    }, []);

    const renderFooter = () => {
        if (!loading || pokemons.length === 0) return null;
        return (
            <View className={styles.list.footer}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    };

    return (
        <FlatList
            data={pokemons}
            renderItem={({ item }) => <PokemonCard pokemon={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            onEndReached={() => loadPokemons()}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            onRefresh={refresh}
            refreshing={loading && pokemons.length === 0}
        />
    );
};

export default PokemonList;
