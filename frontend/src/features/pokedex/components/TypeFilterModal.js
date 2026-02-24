import { Modal, View, Text, TouchableOpacity, FlatList } from "react-native";

const POKEMON_TYPES = [
  "normal","fire","water","electric","grass","ice",
  "fighting","poison","ground","flying","psychic",
  "bug","rock","ghost","dragon","dark","steel","fairy"
];

const TypeFilterModal = ({
  visible,
  onClose,
  selectedTypes,
  setSelectedTypes,
  onApply
}) => {

  const toggleType = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      if (selectedTypes.length >= 2) return;
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View className="flex-1 bg-slate-900 p-5">

        <Text className="text-xl font-bold text-white mb-5">
          Seleccioná hasta 2 tipos
        </Text>

        <FlatList
          data={POKEMON_TYPES}
          numColumns={3}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => {
            const isSelected = selectedTypes.includes(item);

            return (
              <TouchableOpacity
                onPress={() => toggleType(item)}
                className={`
                  flex-1 
                  m-1 
                  py-3 
                  rounded-xl 
                  items-center 
                  ${isSelected ? "bg-cyan-500" : "bg-slate-700"}
                `}
              >
                <Text className="text-white capitalize font-semibold">
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        <TouchableOpacity
          onPress={onApply}
          className="mt-5 py-4 bg-blue-600 rounded-2xl items-center"
        >
          <Text className="text-white font-bold text-base">
            Aceptar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onClose}
          className="mt-3 items-center"
        >
          <Text className="text-slate-400 font-medium">
            Cancelar
          </Text>
        </TouchableOpacity>

      </View>
    </Modal>
  );
};

export default TypeFilterModal;