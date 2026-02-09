import { View, Text, Image,  ActivityIndicator } from "react-native";
import styles from "../../../constants/styles";
import { TYPE_COLORS } from "../../../constants/theme";

const iconMov = {
  status: require("../../../assets/iconMov/status.png"),
  physical: require("../../../assets/iconMov/physical.png"),
  special: require("../../../assets/iconMov/special.png"),
};

const getTypeColor = (type) => TYPE_COLORS[type?.toLowerCase()] || "#A8A77A";

const StatBar = ({ label, value, color }) => {
  const statConfig = {
    poder: { label: "Poder", max: 250 },
    pp: { label: "PP", max: 64 },
    precision: { label: "Precisión", max: 100 },
  };

  const config = statConfig[label] ?? { label, max: 100 };

  const percentage =
    value == null ? 0 : Math.min((value / config.max) * 100, 100);

  return (
    <View className={styles.modalMovement.statRow}>
      <Text className={styles.modalMovement.statLabel}>{config.label}</Text>
      <Text className={styles.modalMovement.statValue}>{value ?? "—"}</Text>

      <View className={styles.modal.statBarContainer}>
        <View
          className={styles.modalMovement.statBar}
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </View>
    </View>
  );
};

export default function MovementModalHeader({
  movimiento,
  loading,
  error,
  pokemonsLength,
}) {
  const backgroundColor = getTypeColor(movimiento.tipo);

  return (
    <>
      <View className={styles.modalMovement.header}>
        <Text className={`${styles.modalMovement.titulo} capitalize`}>
          {movimiento.nombre} #{movimiento.id_movimiento}
        </Text>

        
      </View>

      {movimiento.descripcion && (
        <Text className={styles.modalMovement.descripcion}>
          {movimiento.descripcion}
        </Text>
      )}

      <View className={styles.modalMovement.infoBasica}>
        <Text className={styles.modalMovement.infoBasicaText}>
          Información
        </Text>

        <View className={styles.modalMovement.typeContainer}>
          <Text className={styles.modalMovement.texto}>Tipo:</Text>
          <Text
            className={`${styles.modalMovement.type} capitalize text-base`}
            style={{ backgroundColor }}
          >
            {movimiento.tipo}
          </Text>
        </View>

        <View className={styles.modalMovement.categoryContainer}>
          <Text className={styles.modalMovement.texto}>
            Categoría:   {movimiento.categoria}
          </Text>
          <Image
            source={iconMov[movimiento.categoria]}
            className={styles.modalMovement.iconCategory}
          />
        </View>

        <View className="mt-3 gap-2">
          <StatBar label="poder" value={movimiento.poder} color="#ef4444" />
          <StatBar label="pp" value={movimiento.pp} color="#3b82f6" />
          <StatBar
            label="precision"
            value={movimiento.precision}
            color="#eab308"
          />
        </View>
      </View>

      <Text className="text-xl font-bold mb-4 mt-4">
        Lo aprenden:
      </Text>

      {loading && pokemonsLength === 0 && (
        <ActivityIndicator className="mt-10" />
      )}

      {error && (
        <Text className="text-red-500 mt-2">{error}</Text>
      )}
    </>
  );
}