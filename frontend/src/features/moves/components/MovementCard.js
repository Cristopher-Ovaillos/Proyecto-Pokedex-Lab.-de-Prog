import { View, Text, TouchableOpacity, Image } from "react-native";
import { TYPE_COLORS } from "../../../constants/theme";
import  styles  from "../../../constants/styles";

const iconMov = {
  status: require("../../../assets/iconMov/status.png"),
  physical: require("../../../assets/iconMov/physical.png"),
  special: require("../../../assets/iconMov/special.png"),
};

const getTypeColor = (type) => TYPE_COLORS[type?.toLowerCase()] || "#A8A77A";

export const MovementCard = ({ movimiento, onPress }) => {
  if (!movimiento) {
    return null;
  }

  const tipo = movimiento.tipo;
  const backgroundColor = getTypeColor(tipo);


  return (
    <TouchableOpacity onPress={onPress}>
      <View
        className={styles.movementCard.containerCard}
       
      >
        <View className={styles.movementCard.containerId}>
          <Text className={styles.movementCard.id}>
            {movimiento.id_movimiento}
          </Text>
        </View>
        <View className={styles.movementCard.containerInfo}>
          <Text className={styles.movementCard.name}
          // style={{color: backgroundColor}}
          >{movimiento.nombre}</Text>
          <Text className={styles.movementCard.type}
           style={{ backgroundColor: backgroundColor }}
          >{movimiento.tipo}</Text>
          <Image
            source={iconMov[movimiento.categoria]}
            className={styles.movementCard.iconCategory}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};