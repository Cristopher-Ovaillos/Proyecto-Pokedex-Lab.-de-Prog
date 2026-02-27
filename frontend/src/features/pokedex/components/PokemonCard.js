import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../../../constants/styles';
import { TYPE_COLORS } from '../../../constants/theme';

const getTypeColor = (type) => TYPE_COLORS[type?.toLowerCase()] || '#A8A77A';

const PokemonCardComponent = ({ pokemon, onPress }) => {
    // Si no hay datos del pokémon, no renderizar nada para evitar errores.
    if (!pokemon) {
        return null;
    }

    const tipos = [pokemon.tipo_1, pokemon.tipo_2].filter(Boolean);
    const primaryType = tipos[0];
    const backgroundColor = getTypeColor(primaryType);

    return (
        <TouchableOpacity className={styles.card.touchable} onPress={onPress}>
            <View className={styles.card.container} style={{ backgroundColor: backgroundColor, borderColor: 'rgba(255, 255, 255, 0.4)' }}>
                
               

                <View className={styles.card.imageBg}>
                    <View className={styles.card.imagenContainer}> 
                        <Image
                            source={{ uri: pokemon.imagenUrl }}
                            className={styles.card.image}
                            resizeMode="contain"
                        />

                    </View>
                </View>

                <View className={styles.card.infoContainer}>
                     <Text className={styles.card.id}>#{String(pokemon.id_pokemon).padStart(3, '0')}</Text>

                    <Text className={styles.card.name}>{pokemon.nombre}</Text>
                    <View className={styles.card.typeContainer}>
                        {tipos.map(tipo => (
                            <View key={tipo} className={`${styles.card.typePill} mx-1`}>
                                <Text className={`${styles.drawer.text} capitalize`}>{tipo}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export const PokemonCard = React.memo(PokemonCardComponent);