const { COLORS } = require('./src/constants/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ...COLORS,
      },
      fontFamily: {
        pixel: ['pixel'], // Este es el nombre de tu fuente
      },
    },
  },
  plugins: [],
  presets: [require("nativewind/preset")],
};