import { useEffect } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import styles from "../../../constants/styles";
import MovementModalHeader from "./HeaderModal";

import usePokemonByMovement from "../../../hooks/usePokemonByMovement";

export const MovementModal = ({ visible, onClose, movimiento }) => {
  const {
    pokemons,
    loading,
    error,
    hasMore,
    fetchPokemonsByMovement,
    fetchNextPage,
  } = usePokemonByMovement();

  useEffect(() => {
    if (movimiento?.id_movimiento) {
      fetchPokemonsByMovement(movimiento.id_movimiento);
    }
  }, [movimiento?.id_movimiento]);

  if (!movimiento) return null;

  //renderizar los pokemons que aprenden ese movimiento
  const renderPokemon = ({ item }) => {
    const imageUrl = `https://res.cloudinary.com/dsagyolzc/image/upload/${item.id_pokemon}.png`;

    return (
      <View className={styles.modalMovement.cardPoke}>
        <View className={styles.modalMovement.imagePokemonContainer}>
          <Image
            source={{ uri: imageUrl }}
            className="w-14 h-14"
            resizeMode="contain"
          />
        </View>

        <View className={styles.modalMovement.infoPoke}>
          <Text className="capitalize font-bold">{item.nombre}</Text>
          <Text className="capitalize">Metodo: {item.metodo_aprendizaje}</Text>
          {item.nivel != null ? (
            <Text className="capitalize">Nivel: {item.nivel}</Text>
          ) : (
            <Text className="itallic">Nivel: No aplica</Text>
          )}
        </View>
      </View>
    );
  };

  //modal que tiene una flatlist con un header con la info del movimiento y los elementos
  // son los pokemons que aprenden tal movimiento
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className={styles.modalMovement.overlay}>
        <View className={styles.modalMovement.container}>
          <TouchableOpacity
            onPress={onClose}
            className={styles.modalMovement.cerrarBotton}
          >
            <Text className={styles.modalMovement.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <FlatList
            data={pokemons}
            keyExtractor={(item, index) =>
              `${item.id_pokemon}-${item.metodo ?? index}`
            }
            renderItem={renderPokemon}
            contentContainerStyle={{ padding: 20 }}
            onEndReached={() => {
              if (hasMore && !loading) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={
              <MovementModalHeader
                movimiento={movimiento}
                loading={loading}
                error={error}
                pokemonsLength={pokemons.length}
              />
            }
            ListFooterComponent={
              loading && pokemons.length > 0 ? (
                <ActivityIndicator style={{ marginVertical: 20 }} />
              ) : null
            }
          />
        </View>
      </View>
    </Modal>
  );
};