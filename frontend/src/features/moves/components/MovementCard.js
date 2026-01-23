import { View, Text, TouchableOpacity } from "react-native";
import styles from "../../../constants/styles";
import { TYPE_COLORS } from '../../../constants/theme';

const getTypeColor = (type) => TYPE_COLORS[type?.toLowerCase()] || '#A8A77A';

export const MovementCard = ({ movimiento, onPress }) => {
  if (!movimiento) {
    return null;
  }

  const tipo =movimiento.tipo;
  const backgroundColor = getTypeColor(tipo);

  

  return (
    <TouchableOpacity
      className={styles.card.touchable} onPress={onPress} >

        <View className={styles.movementCard.container} style={{ backgroundColor: backgroundColor }}>
          <Text >{movimiento.id_movimiento}</Text>
          <Text>{movimiento.nombre}</Text>
          <Text className={styles.movementCard.type}>{movimiento.tipo}</Text> 
          <Text className={styles.movementCard.category}>{movimiento.categoria}</Text>

        </View>  
      </TouchableOpacity>
  )
}

