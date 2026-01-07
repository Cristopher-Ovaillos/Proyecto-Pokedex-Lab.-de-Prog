import { Text, View} from 'react-native';
import PokemonList from '../components/PokemonList';
import styles from '../../../constants/styles';

export const PokedexScreen = () => {
  return (
    <View className={styles.app.container}>
      <Text className={styles.app.title}>
        Pokedex
      </Text>
      <PokemonList />
    </View>
  );
};
