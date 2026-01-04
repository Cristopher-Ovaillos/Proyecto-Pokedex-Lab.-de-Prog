/** @type {import('tailwindcss').Config} */
//nuevo:
const { colores } = require("./src/constants/colors");

//
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        prstartk: ["prstartk"],
      }, 
      colors: {
        // usamos lo definido en src/constants
        pokedex: colores
      },
    },
  },
  plugins: [],
}