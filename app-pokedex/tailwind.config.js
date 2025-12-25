/** @type {import('tailwindcss').Config} */

module.exports = {
  // 1. Indicamos las rutas de todos nuestros componentes
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // tematica 8 bits, definimos colores y fuente
      colors: {
        pokeDark: "#1a1a1a",
        pokeRetro: "#f0f0f0",
      },
      fontFamily: {
        pixel: ["PressStart2P"], 
      },
    },
  },
  plugins: [],
}