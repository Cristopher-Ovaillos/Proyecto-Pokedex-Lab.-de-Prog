// src/styles.js
const baseBg = "bg-pokedex-light-background dark:bg-pokedex-dark-background";
const baseText = "font-prstartk text-pokedex-light-text dark:text-pokedex-dark-text";
const baseBorder = "border-4 border-pokedex-light-border dark:border-pokedex-dark-border";

export const estilos = {
  pantalla: `flex-1 ${baseBg} p-4`,
  tarjeta: `${baseBorder} ${baseBg} p-4 shadow-md`,
  texto: `${baseText} text-sm`,
  titulo: `${baseText} text-xl mb-4`,
  
  // Sidebar (Drawer)
  sidebar: `flex-1 ${baseBg} p-6 border-r-4 border-black`,
  itemMenu: "p-4 mb-2 border-2 border-transparent active:bg-pokedex-light-primary/20",
  
  // Botones
  boton: "bg-pokedex-light-primary p-4 border-b-4 border-r-4 border-black active:border-0",
  divisor: "h-1 w-full bg-pokedex-light-muted my-4",
};