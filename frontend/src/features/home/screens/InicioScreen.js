import { useEffect, useState, useRef } from "react";
import { View, Image, Animated, Easing } from "react-native";
import InfoInicio from "../components/InfoInicio";

// animaciones
const pikachuIntro = require("../../../assets/fondosInicio/pikachuPngGif.gif");
const tituloPokemon = require("../../../assets/fondosInicio/tituloPokemon.gif");

export const InicioScreen = () => {
  const [phase, setPhase] = useState("pikachu");

  const translateY = useRef(new Animated.Value(300)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pikachuTimer = setTimeout(() => {
      setPhase("titulo");

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => {
          setPhase("none");
        }, 2000);
      });
    }, 2000);

    return () => clearTimeout(pikachuTimer);
  }, []);

  return (
    <View className="flex-1">

      {/* Contenido (toda la info) */}
      <InfoInicio />

      {/* Fase Pikachu */}
      {phase === "pikachu" && (
        <View className="absolute inset-0 bg-slate-100 justify-center items-center">
          <Image
            source={pikachuIntro}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
      )}

      {/* Fase Título */}
      {phase === "titulo" && (
        <View className="absolute inset-0 bg-white justify-center items-center">
          <Animated.Image
            source={tituloPokemon}
            style={{
              width: "90%",
              height: 200,
              transform: [{ translateY }],
              opacity,
            }}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
};