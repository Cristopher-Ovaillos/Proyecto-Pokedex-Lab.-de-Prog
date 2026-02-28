import { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Collapsible from "react-native-collapsible";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import styles from "../../../constants/styles";

const CardInfo = ({
  image,
  title,
  bgColor = "",
  titleBgColor = "",
  children,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className={`${styles.home.seccion} ${bgColor}`}>
      
      <View className="w-full items-center justify-center overflow-hidden rounded-lg border border-black/70">
        <Image
          source={image}
          style={{ width: "100%", height: 256 }}
          resizeMode="cover"
        />
      </View>

      <Text className={`${styles.home.titulo} ${titleBgColor}`}>
        {title}
      </Text>

      <Collapsible collapsed={!expanded} duration={400}>
        <View className="mt-2">
          {children}
        </View>
      </Collapsible>

      <TouchableOpacity
        className="self-center mt-2"
        onPress={() => setExpanded(!expanded)}
      >
        <FontAwesome5
          name={expanded ? "chevron-circle-up" : "chevron-circle-down"}
          size={30}
          color="#000000"
        />
      </TouchableOpacity>
    </View>
  );
};

export default CardInfo;