import { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import api from '../../../api/apiclient';
import { ENDPOINTS } from '../../../config';
import styles from '../../../constants/styles';
import { TYPE_COLORS } from '../../../constants/theme';

const getTypeColor = (type) => TYPE_COLORS[type?.toLowerCase()] || '#A8A77A';

// Componente para la barra de stat, se mantiene simple y dentro del mismo archivo.
const StatBar = ({ label, value, color }) => {
    const statLabels = {
        hp_base: 'HP',
        ataque_base: 'Ataque',
        defensa_base: 'Defensa',
        ataque_especial_base: 'At. Esp.',
        defensa_especial_base: 'Def. Esp.',
        velocidad_base: 'Velocidad'
    };
    const maxStat = 255;
    const percentage = Math.min((value / maxStat) * 100, 100); // Asegura que no pase del 100%

    return (
        <View className={styles.modal.statRow}>
            <Text className={styles.modal.statLabel}>{statLabels[label] || label}</Text>
            <Text className={styles.modal.statValue}>{value}</Text>
            <View className={styles.modal.statBarContainer}>
                <View className={styles.modal.statBar} style={{ width: `${percentage}%`, backgroundColor: color }} />
            </View>
        </View>
    );
};

export const PokemonDetailModal = ({ visible, onClose, pokemonId }) => {
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!pokemonId) return;

        const fetchPokemonDetail = async () => {
            setLoading(true);
            setError(null);
            setPokemon(null);
            try {
                const response = await api.get(ENDPOINTS.ENCICLOPEDIA.POKEMON_DETAIL(pokemonId));
                setPokemon(response.data);
            } catch (err) {
                setError("No se pudo cargar la info.");
            } finally {
                setLoading(false);
            }
        };
        fetchPokemonDetail();
    }, [pokemonId]); //depende, de la id...es decir cambia segun el pokemon que seleccionemos lo cual activa esto
    

    const primaryType = pokemon?.tipo_1; // usar el simbolo ? para no tener problema de null
    const backgroundColor = getTypeColor(primaryType);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className={styles.modal.overlay}>
         
                <View className={styles.modal.container} style={{ backgroundColor: backgroundColor || '#4A5568' }}>
                    <TouchableOpacity onPress={onClose} className={styles.modal.closeButton}>
                        <Text className={styles.modal.closeButtonText}>✕</Text>
                    </TouchableOpacity>

                    {loading && <ActivityIndicator size="large" color="#fff" className="flex-1" />}
                    
                    {error && <Text className={`${styles.ui.error} text-white self-center`}>{error}</Text>}

                    {pokemon && (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View className={styles.modal.header}>
                                <Text className={styles.modal.pokemonName}>{pokemon.nombre}</Text>
                                <Text className={styles.modal.pokemonId}>#{String(pokemon.id_pokemon).padStart(3, '0')}</Text>
                            </View>

                            <View className={styles.modal.imageBg}>
                                <View className={styles.modal.containerImg}>

                                    <Image source={{ uri: pokemon.imagenUrl }} className={styles.modal.image} resizeMode="contain" />
                                </View>
                            </View>

                            <View className="flex-row justify-center my-4 gap-2">
                                {[pokemon.tipo_1, pokemon.tipo_2].filter(Boolean).map((tipo,index) => (
                                    <View key={index} className={`${styles.card.typePill} mx-1 px-4 py-3`}>
                                        <Text className={`${styles.drawer.text}  capitalize`}>{tipo}</Text>
                                    </View>
                                ))}
                            </View>

                            {pokemon.estadisticas && (
                                <View className={styles.modal.detailsContainer}>
                                    <Text className={styles.modal.sectionTitle}>Stats Base</Text>
                                    {Object.entries(pokemon.estadisticas).map(([key, value]) => (
                                        <StatBar key={key} label={key} value={value} color={backgroundColor} />
                                    ))}
                                </View>
                            )}

                             {pokemon.habilidades && (
                                <View className={`${styles.modal.detailsContainer} mt-4`}>
                                    <Text className={styles.modal.sectionTitle}>Habilidades</Text>
                                    {pokemon.habilidades?.map((h, index) => (
                                        <View key={index} className={styles.modal.abilityContainer}>
                                            <Text className={styles.modal.abilityName}>{h.nombre} {h.oculta && '(Oculta)'}</Text>
                                            <Text className={styles.modal.abilityDescription}>{h.descripcion.replace(/\n/g, ' ')}</Text>
                                        </View>
                                    ))}
                                </View>
                             )}
                        </ScrollView>
                    )}
                </View>
            </View>
        </Modal>
    );
};

