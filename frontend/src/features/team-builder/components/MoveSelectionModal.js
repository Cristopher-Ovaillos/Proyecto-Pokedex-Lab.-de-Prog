import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Modal,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import styles from "../../../constants/styles";
import { TYPE_COLORS } from "../../../constants/theme";
import api from "../../../api/apiclient";
import { ENDPOINTS } from "../../../config";

const MoveSelectionModal = ({ visible, onClose, pokemonId, onSelectMoves, currentMoves = [] }) => {
    const [moves, setMoves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMoves, setSelectedMoves] = useState([]);

    useEffect(() => {
        if (visible && pokemonId) {
            fetchMoves();
            setSelectedMoves(currentMoves || []);
        }
    }, [visible, pokemonId]);

    const fetchMoves = async () => {
        setLoading(true);
        try {
            // Endpoint para obtener movimientos de un pokemon especifico
            // Si no existe, usamos el general filtrado (depende de la API)
            // Basado en enciclopediaRoutes: router.get('/pokemon/:id/movimientos', ...);
            const response = await api.get(ENDPOINTS.ENCICLOPEDIA.POKEMON_MOVIMIENTOS(pokemonId));
            setMoves(response.data || []);
        } catch (error) {
            console.error("Error fetching moves:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleMove = (move) => {
        if (selectedMoves.some((m) => m.id_movimiento === move.id_movimiento)) {
            setSelectedMoves(selectedMoves.filter((m) => m.id_movimiento !== move.id_movimiento));
        } else {
            if (selectedMoves.length < 4) {
                setSelectedMoves([...selectedMoves, move]);
            }
        }
    };

    const handleConfirm = () => {
        onSelectMoves(selectedMoves);
        onClose();
    };

    const getTypeColor = (type) => TYPE_COLORS[type?.toLowerCase()] || "#A8A77A";

    const renderItem = ({ item }) => {
        const isSelected = selectedMoves.some((m) => m.id_movimiento === item.id_movimiento);
        const bgColor = getTypeColor(item.tipo);

        return (
            <TouchableOpacity
                className={`${styles.moveSelectionModal.moveItem} ${isSelected ? styles.moveSelectionModal.selectedMoveItem : ''}`}
                style={{ borderColor: bgColor }}
                onPress={() => toggleMove(item)}
            >
                <View style={{ flex: 1 }}>
                    <Text className={styles.moveSelectionModal.moveName} style={{ color: bgColor }}>
                        {item.nombre}
                    </Text>
                    <Text className={styles.moveSelectionModal.moveType}>{item.tipo} | Poder: {item.poder || '-'}</Text>
                </View>
                {isSelected && (
                    <FontAwesome5 name="check-circle" size={20} color={bgColor} />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View className={styles.moveSelectionModal.overlay}>
                <View className={styles.moveSelectionModal.content}>
                    <View className={styles.moveSelectionModal.header}>
                        <Text className={styles.moveSelectionModal.title}>Selecciona Movimientos ({selectedMoves.length}/4)</Text>
                        <TouchableOpacity onPress={onClose}>
                            <FontAwesome5 name="times" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 20 }} />
                    ) : (
                        <FlatList
                            data={moves}
                            keyExtractor={(item) => item.id_movimiento.toString()}
                            renderItem={renderItem}
                            contentContainerStyle={{ padding: 10 }}
                            style={{ maxHeight: 400 }}
                        />
                    )}

                    <TouchableOpacity
                        className={`${styles.moveSelectionModal.confirmButton} ${selectedMoves.length === 0 ? 'opacity-50' : ''}`}
                        onPress={handleConfirm}
                        disabled={selectedMoves.length === 0}
                    >
                        <Text className={styles.moveSelectionModal.confirmText}>Confirmar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default MoveSelectionModal;
