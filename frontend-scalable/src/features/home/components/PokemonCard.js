import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { COLORS, TYPE_COLORS } from '../../../constants/theme';
import styles from '../../../constants/styles';

// este es un componente de presentacion (o "tonto").
// su unica funcion es mostrar los datos de un pokemon que recibe de su padre ('pokedexscreen').
// no tiene logica de negocio ni estado propio complejo.
const PokemonCard = ({ pokemon, onPress }) => {
    // el componente padre le pasa el objeto 'pokemon' y la funcion 'onpress' como props.
    
    // si por alguna razon el pokemon no llega, no renderiza nada para evitar un error.
    if (!pokemon) {
        return null; 
    }
    
    // extrae el tipo primario para decidir el color de fondo de la tarjeta.
    const primaryType = pokemon.types?.[0]?.type?.name || 'normal';
    const cardColor = TYPE_COLORS[primaryType] || COLORS.light;

    // pone en mayuscula la primera letra del nombre.
    const pokemonName = pokemon.name
        ? pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
        : 'Desconocido';

    return (
        // este es el boton que envuelve toda la tarjeta.
        // al presionarlo, llama a la funcion 'onpress' que le paso el padre.
        <TouchableOpacity
            onPress={onPress}
            className={styles.pokemonCard.touchable}
        >
            {/* el view principal de la tarjeta. */}
            {/* el color de fondo es dinamico, por eso se usa 'style' en lugar de 'classname'. */}
            {/* los estilos de 'styles.js' (tailwind) no pueden manejar colores que cambian dinamicamente. */}
            <View
                style={{ backgroundColor: cardColor }}
                className={styles.pokemonCard.container}
            >
                {/* contenedor de la imagen */}
                <View className={styles.pokemonCard.imageContainer}>
                    <Image
                        source={{ uri: pokemon.sprites?.front_default }}
                        className={styles.pokemonCard.image}
                        resizeMode="contain"
                    />
                </View>

                {/* contenedor de la informacion de texto */}
                <View className={styles.pokemonCard.infoContainer}>
                    <Text className={styles.pokemonCard.id}>
                        #{String(pokemon.id || '000').padStart(3, '0')}
                    </Text>
                    <Text className={styles.pokemonCard.name}>
                        {pokemonName}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default PokemonCard;