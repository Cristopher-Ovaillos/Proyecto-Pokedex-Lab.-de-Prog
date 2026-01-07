/** @type {import('tailwindcss').Config} */
const { COLORS } = require('./src/constants/theme');

module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Mapeo directo de src/constants/theme.js a clases de tailwind
        // Uso: className="bg-primary text-text"
        primary: COLORS.primary,
        secondary: COLORS.secondary,
        appBg: COLORS.background,
        textMain: COLORS.text,
        error: COLORS.error,
      },
      fontFamily: {
        // Uso: className="font-brand"
        // Asegurate de cargar la fuente en App.js antes de usarla
        // brand: ["NombreFuenteEnAssets"], 
        pixel: ["pixel"], // Ejemplo usando fuente del sistema
      },
    },
  },
  plugins: [],
}
