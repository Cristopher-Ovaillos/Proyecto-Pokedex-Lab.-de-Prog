import { View, Text, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from '@expo/vector-icons/AntDesign'


const styles = require("../../constants/styles");

const OptionPerfil = ({ value, onEdit, className, nameIcon }) => {
  return (
    <TouchableOpacity
      onPress={onEdit}
      className={`${styles.perfil.vistaEditarAtributo} ${className ?? ""}`}
    >

      <FontAwesome
        className="rounded-full bg-sky-200 p-2 mr-5"
        name={nameIcon ?? "pencil-square-o"}
        size={12}
        color="#000000"
      />

      <Text className="text-lg px-4">{value}</Text>

      <AntDesign className="ml-auto" name="right" size={12} color="#000000" />
      
    </TouchableOpacity>
  );
};

export default OptionPerfil;
