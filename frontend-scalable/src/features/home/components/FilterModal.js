import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import styles from "../../../constants/styles";
import { TYPE_COLORS } from "../../../constants/theme";

const POKEMON_TYPES = Object.keys(TYPE_COLORS);
const SORT_OPTIONS = [
    { by: 'id', order: 'asc', label: 'ID Ascendente' },
    { by: 'id', order: 'desc', label: 'ID Descendente' },
    { by: 'name', order: 'asc', label: 'Nombre A-Z' },
    { by: 'name', order: 'desc', label: 'Nombre Z-A' },
];

const FilterModal = ({ visible, onClose, currentType, currentSort, onApply }) => {
    const [selectedType, setSelectedType] = useState(currentType);
    const [selectedSort, setSelectedSort] = useState(currentSort);

    // efecto para asegurar que el estado del modal se sincroniza
    // con los filtros activos en la pokedex cada vez que se abre.
    useEffect(() => {
        setSelectedType(currentType);
        setSelectedSort(currentSort);
    }, [visible, currentType, currentSort]);

    const handleApply = () => {
        onApply({ type: selectedType, sort: selectedSort });
        onClose();
    };

    const isSortSelected = (sortOpt) => {
        return selectedSort.by === sortOpt.by && selectedSort.order === sortOpt.order;
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <TouchableOpacity 
                activeOpacity={1} 
                onPress={onClose} 
                className={styles.filterModal.centeredView}
            >
                <TouchableOpacity activeOpacity={1} className={styles.filterModal.modalView}>
                    <Text className={styles.filterModal.title}>Filtros y Orden</Text>
                    
                    <ScrollView>
                        {/* seccion de tipos */}
                        <Text className={styles.filterModal.sectionTitle}>Tipo de Pokémon</Text>
                        <View className={styles.filterModal.typeContainer}>
                            <TouchableOpacity
                                onPress={() => setSelectedType('')}
                                className={`${styles.filterModal.typeButton} ${selectedType === '' ? styles.filterModal.typeButtonSelected : styles.filterModal.typeButtonUnselected}`}
                            >
                                <Text className={styles.filterModal.typeText}>Todos</Text>
                            </TouchableOpacity>
                            {POKEMON_TYPES.map(type => (
                                <TouchableOpacity
                                    key={type}
                                    onPress={() => setSelectedType(type)}
                                    // se usa 'style' para el color de fondo dinamico y el borde.
                                    // el borde blanco ahora es mas grueso para que la seleccion sea mas obvia.
                                    style={{ 
                                        backgroundColor: TYPE_COLORS[type], 
                                        borderColor: selectedType === type ? 'white' : TYPE_COLORS[type], 
                                        borderWidth: 2 
                                    }}
                                    className={styles.filterModal.typeButton}
                                >
                                    <Text style={{color: 'white'}} className={styles.filterModal.typeText}>{type}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* seccion de orden */}
                        <Text className={styles.filterModal.sectionTitle}>Ordenar por</Text>
                        <View className={styles.filterModal.sortContainer}>
                            {SORT_OPTIONS.map(opt => {
                                const isSelected = isSortSelected(opt);
                                return (
                                    <TouchableOpacity
                                        key={opt.label}
                                        onPress={() => setSelectedSort({ by: opt.by, order: opt.order })}
                                        // se combinan las clases: las del boton base y la de seleccionado si aplica.
                                        className={`${styles.filterModal.sortButton} ${isSelected ? styles.filterModal.sortButtonSelected : ''}`}
                                    >
                                        <Text className={isSelected ? styles.filterModal.sortTextSelected : styles.filterModal.sortText}>
                                            {opt.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>

                    {/* boton para aplicar */}
                    <TouchableOpacity onPress={handleApply} className={styles.filterModal.applyButton}>
                        <Text className={styles.filterModal.applyButtonText}>Aplicar filtros</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

export default FilterModal;
