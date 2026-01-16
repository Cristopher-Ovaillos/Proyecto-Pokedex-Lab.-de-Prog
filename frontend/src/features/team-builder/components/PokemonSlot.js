import { Text, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import styles from '../../../constants/styles';

//si hay codigo  {}
const PokemonSlot = ({ pokemon, onSelect }) => {
    return (
        <TouchableOpacity className={styles.teamBuilder.slot} onPress={onSelect}>

            {pokemon ? (
                <>
                    <Image
                        source={{ uri: pokemon.imagenUrl}}
                        className={styles.teamBuilder.slotPokemonImage}
                        resizeMode="contain"
                    />
                    <Text className={styles.teamBuilder.slotPokemonName}>
                        {pokemon.nombre}
                    </Text>
                </>

            ) : (
                <FontAwesome5 name="plus" size={32} color="rgba(255,255,255,0.4)"/>
            )}

        </TouchableOpacity>
    );
};
export default PokemonSlot;
