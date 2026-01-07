import { View, Text, Image, TouchableOpacity } from 'react-native';
import { TYPE_COLORS } from '../../../constants/theme';
import styles from '../../../constants/styles';

const PokemonCard = ({ pokemon, onPress }) => {
    //para mostrar el id del pokemon en vez de '1' mostrar '001'
    const formatedId = `#${String(pokemon.id).padStart(3, '0')}`;
    const primaryType = pokemon.types[0]?.type.name; //mirar usePOkedex
    const cardBackgroundColor = TYPE_COLORS[primaryType];

    console.log({pokemon});
    return (
        <TouchableOpacity className={styles.card.touchable} onPress={onPress}>
            <View className={ styles.card.container}  style={{backgroundColor: cardBackgroundColor}}>
                <View className={styles.card.imageContainer}>
                    <Image 
                    source={{uri:pokemon.image}}
                    className={styles.card.image}
                    resizeMode="contain"
                    />
                </View>

                <View className={styles.card.infoContainer}>
                    <Text className={styles.card.id}>
                        {formatedId}
                    </Text>
                    <Text className={styles.card.name}>
                        {pokemon.name}
                    </Text>

                </View>

                <View>
                    {
                        pokemon.types.map(({ type }) => (
                            <View key={type.name} className={styles.card.typePill}>
                                <Text>
                                    {type.name}
                                </Text>
                            </View>

                        ))


                    }



                </View>

                <View>


                </View>
            </View>





        </TouchableOpacity>
    );



};
export default PokemonCard;