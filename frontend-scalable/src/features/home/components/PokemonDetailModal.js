import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
// este modal tiene su propio hook para buscar los detalles del pokemon.
// esto es bueno porque la logica de buscar un pokemon especifico esta encapsulada
// y no sobrecarga el hook principal 'usepokedex'.
import usePokemonDetail from '../../../hooks/usePokemonDetail';
import styles from '../../../constants/styles';
import { COLORS, TYPE_COLORS } from '../../../constants/theme';

// componente pequeño para mostrar una barra de estadistica.
const Stat = ({ name, value, max = 255 }) => {
    const barPercentage = (value / max) * 100;
    const statColor = value > max / 2 ? COLORS.success : COLORS.warning;

    return (
        <View className={styles.pokemonDetailModal.statRow}>
            <Text className={styles.pokemonDetailModal.statName}>{name}</Text>
            <Text className={styles.pokemonDetailModal.statValue}>{value}</Text>
            <View className={styles.pokemonDetailModal.statBar}>
                <View 
                    style={{ width: `${barPercentage}%`, backgroundColor: statColor }}
                    className={styles.pokemonDetailModal.statBarFill}
                />
            </View>
        </View>
    );
};

// este es el componente del modal de detalle.
// recibe la id del pokemon a mostrar de su padre ('pokedexscreen').
const PokemonDetailModal = ({ pokemonId, visible, onClose }) => {
    // usa su propio hook 'usepokemondetail' para obtener los datos.
    // le pasa la 'pokemonid' que recibio del padre.
    const { pokemon, loading, error } = usePokemonDetail(pokemonId);

    // funcion que decide que mostrar dentro del modal.
    const renderContent = () => {
        // si esta cargando, muestra un spinner.
        if (loading) {
            return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 40 }} />;
        }

        // si hay un error o no hay datos del pokemon, muestra un mensaje.
        if (error || !pokemon) {
            return <Text style={{ textAlign: 'center', padding: 20 }}>{error || 'No se encontró el Pokémon.'}</Text>;
        }

        // si todo esta bien, muestra los detalles.
        const primaryType = pokemon.types?.[0]?.type?.name || 'normal';
        const headerColor = TYPE_COLORS[primaryType] || COLORS.light;
        const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        const stats = pokemon.stats || [];

        return (
            <View className={styles.pokemonDetailModal.container}>
                {/* cabecera con color dinamico */}
                <View style={{ backgroundColor: headerColor }} className={styles.pokemonDetailModal.header}>
                    <TouchableOpacity onPress={onClose} className={styles.pokemonDetailModal.closeButton}>
                        <Text className={styles.pokemonDetailModal.closeIcon}>X</Text>
                    </TouchableOpacity>

                    <Image
                        source={{ uri: pokemon.sprites?.front_default }}
                        className={styles.pokemonDetailModal.image}
                        resizeMode="contain"
                    />
                    <Text className={styles.pokemonDetailModal.id}>#{String(pokemon.id).padStart(3, '0')}</Text>
                    <Text className={styles.pokemonDetailModal.name}>{pokemonName}</Text>
                    
                    {/* seccion de tipos */}
                    <View className={styles.pokemonDetailModal.typeContainer}>
                        {pokemon.types.map(({ type }) => (
                            <View 
                                key={type.name} 
                                style={{ backgroundColor: TYPE_COLORS[type.name] || COLORS.dark }}
                                className={styles.pokemonDetailModal.typeBadge}
                            >
                                <Text className={styles.pokemonDetailModal.typeBadgeText}>{type.name}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* area de contenido con scroll */}
                <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                    <View className={styles.pokemonDetailModal.content}>
                        {/* estadisticas base */}
                        <Text className={styles.pokemonDetailModal.sectionTitle}>Stats Base</Text>
                        {stats.map(stat => (
                            <Stat key={stat.stat.name} name={stat.stat.name} value={stat.base_stat} />
                        ))}
                    </View>
                </ScrollView>
            </View>
        );
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible} // la visibilidad es controlada por el padre.
            onRequestClose={onClose}
        >
            {/* el fondo oscuro semitransparente. al tocarlo, se cierra el modal. */}
            <TouchableOpacity 
                activeOpacity={1} 
                onPress={onClose} 
                className={styles.pokemonDetailModal.overlay}
            >
                {/* este touchable previene que el modal se cierre al tocar el contenido. */}
                <TouchableOpacity activeOpacity={1} style={{width: '90%'}}>
                  {renderContent()}
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

export default PokemonDetailModal;