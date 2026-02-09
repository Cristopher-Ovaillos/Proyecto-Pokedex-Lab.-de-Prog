import { Text, TouchableOpacity, Image, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import styles from '../../../constants/styles';

//si hay codigo  {}
const PokemonSlot = ({ pokemon, onSelect, onEditMoves }) => {
    return (
        <View className="m-1 items-center">
            <TouchableOpacity className={styles.teamBuilder.slot} onPress={onSelect}>
                {pokemon ? (
                    <>
                        <Image
                            source={{ uri: pokemon.imagenUrl }}
                            className={styles.teamBuilder.slotPokemonImage}
                            resizeMode="contain"
                        />
                        <Text className={styles.teamBuilder.slotPokemonName}>
                            {pokemon.nombre}
                        </Text>
                    </>
                ) : (
                    <FontAwesome5 name="plus" size={32} color="rgba(255,255,255,0.4)" />
                )}
            </TouchableOpacity>

            {pokemon && (
                <TouchableOpacity
                    style={{ marginTop: 5, padding: 5, backgroundColor: "#374151", borderRadius: 5 }}
                    onPress={onEditMoves}
                >
                    <Text style={{ color: "white", fontSize: 10, textAlign: "center" }}>
                        {pokemon.movimientos && pokemon.movimientos.length > 0
                            ? `${pokemon.movimientos.length} Mov.`
                            : "+ Movimientos"}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};
export default PokemonSlot;
