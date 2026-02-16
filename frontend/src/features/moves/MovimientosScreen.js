import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import styles from "../../constants/styles";
import { MovementCard } from "./components/MovementCard";
import { debounce } from "lodash";
import useMovements from "../../hooks/useMovements";
import { MovementModal } from "./components/MovementModal";

export const MovimientosScreen = () => {
  const { movements, loading, error, searchMovements, fetchNextPage, hasMore } =
    useMovements();

  const [searchTerm, setSearchTerm] = useState("");

  // State para el modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);

  
  const handlePressCard = (mov) => {
    setSelectedMovement(mov);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedMovement(null);
  };

  const debouncedSearchRef = useRef(
    debounce((term) => {
      searchMovements({ search: term });
    }, 500),
  );

  useEffect(() => {
    debouncedSearchRef.current(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    return () => {
      debouncedSearchRef.current.cancel();
    };
  }, []);

  const renderFooter = () => {
    if (loading && movements.length > 0) {
      return (
        <ActivityIndicator
          size="large"
          style={{ marginVertical: 20 }}
          color="#3B82F6"
        />
      );
    }
    return null;
  };

  return (
    <View className={styles.layout.screen}>
      <Text className={styles.ui.titleMain}>Pantalla de Movimientos</Text>

      <TextInput
        className={styles.ui.input}
        placeholder="Buscar por nombre o número..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholderTextColor="#9CA3AF"
        style={{
          backgroundColor: "#374151",
          color: "white",
          borderColor: "#4B5563",
        }}
      />

      {loading && movements.length === 0 ? (
        <ActivityIndicator
          size="large"
          style={{ marginVertical: 20 }}
          color="#3B82F6"
        />
      ) : error ? (
        <Text
          style={{
            ...styles.ui.label,
            color: "red",
            textAlign: "center",
          }}
        >
          {error}
        </Text>
      ) : (
        <FlatList
          data={movements}
          keyExtractor={(item) => item.id_movimiento.toString()}
          renderItem={({ item }) => (
            <MovementCard
              movimiento={item}
              onPress={() => handlePressCard(item)}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 5 }}
          onEndReached={() => {
            if (hasMore && !loading) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={() =>
            !loading && (
              <Text
                style={{
                  ...styles.ui.label,
                  color: "white",
                  textAlign: "center",
                }}
              >
                No se encontraron movimientos.
              </Text>
            )
          }
        />
      )}

      {selectedMovement && (
        <MovementModal
          visible={modalVisible}
          onClose={handleCloseModal}
          movimiento={selectedMovement}
        />
      )}
    </View>
  );
};