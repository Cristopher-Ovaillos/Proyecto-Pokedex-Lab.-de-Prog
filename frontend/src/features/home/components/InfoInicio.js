import { View, ScrollView, Text } from "react-native";
import CardInfo from "./CardInfo";
import styles from "../../../constants/styles";

// imágenes
const pokemonAnimation = require("../../../assets/fondosInicio/gif_portada2.gif");
const pokedex = require("../../../assets/fondosInicio/pokedex.gif");
const movimientos = require("../../../assets/fondosInicio/movimientos4.png");
const perfil = require("../../../assets/fondosInicio/perfil.jpg");
const equipo = require("../../../assets/fondosInicio/equipo.jpg");

const InfoInicio = () => {
  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-2 py-6 items-center gap-4"
    >
      <CardInfo
        image={pokemonAnimation}
        title="Tu Aventura Comienza"
        bgColor="bg-amber-300"
        titleBgColor="bg-orange-600"
      >
        <Text className={styles.home.texto_seccion}>
          ¡Bienvenido al mundo de POKÉMMO! Un lugar habitado por criaturas
          fascinantes llamadas Pokémon... Tu propia leyenda está a punto de
          comenzar...
        </Text>
      </CardInfo>

      <CardInfo
        image={pokedex}
        title="Explora la Pokedex"
        bgColor="bg-red-500"
        titleBgColor="bg-gray-800"
      >
        <Text className={styles.home.texto_seccion}>
          Explorá un total de <Text className="font-bold">649 Pokémon</Text>,
          abarcando todas las criaturas desde la primera hasta la{" "}
          <Text className="font-bold">quinta generación</Text>.{"\n\n"}
          Al hacer <Text className="font-bold">click</Text> en cualquier
          Pokémon, podrás consultar sus estadísticas base, habilidades y otros
          datos importantes para conocerlo en profundidad.
        </Text>
      </CardInfo>

      <CardInfo
        image={movimientos}
        title="Explora Movimientos"
        bgColor="bg-blue-500"
        titleBgColor="bg-indigo-700"
      >
        <Text className={styles.home.texto_seccion}>
          Descubrí un total de{" "}
          <Text className="font-bold">679 movimientos</Text>, cada uno con sus
          características únicas. Podrás explorar en detalle sus estadísticas,
          potencia, precisión y descripción para entender cómo influyen en
          cada combate.
        </Text>
      </CardInfo>

      <CardInfo
        image={perfil}
        title="Edita tu perfil"
        bgColor="bg-emerald-400"
        titleBgColor="bg-emerald-800"
      >
        <Text className={styles.home.texto_seccion}>
          Gestioná tu cuenta fácilmente. Podrás cambiar tu nombre de usuario,
          actualizar tu contraseña, modificar tu email y cerrar sesión cuando
          lo necesites, manteniendo siempre el control total de tu perfil.
        </Text>
      </CardInfo>

      <CardInfo
        image={equipo}
        title="Forma tu Equipo"
        bgColor="bg-purple-500"
        titleBgColor="bg-purple-800"
      >
        <Text className={styles.home.texto_seccion}>
          Armá tu propio team Pokémon y organizalo a tu manera. Podrás guardar
          el nombre de tu equipo junto con los Pokémon que lo componen y los
          movimientos elegidos para cada uno, creando combinaciones
          estratégicas listas para el combate.
        </Text>
      </CardInfo>
    </ScrollView>
  );
};

export default InfoInicio;