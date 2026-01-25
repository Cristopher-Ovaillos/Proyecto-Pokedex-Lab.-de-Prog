
const styles = {
  login: {
    container: "flex-1 bg-background  p-4 justify-center items-center",
    title: "text-primary text-2xl font-pixel",
    input: "w-full border-gray-300 rounded px-4 py-2 mb-4 font-pixel",
    button:
      "bg-secondary w-full py-3 rounded-lg shadow-sm active:opacity-80 font-pixel",
    buttonText: "text-white text-center font-pixel font-pixel",
    errorText: "text-error text-sm mb-4",
  },
  register: {
    container: "flex-1 bg-background  p-4 justify-center items-center",
    title: "text-primary text-2xl font-pixel",
    input: "w-full border-gray-300 rounded px-4 py-2 mb-4 font-pixel",
    button:
      "bg-secondary w-full py-3 rounded-lg shadow-sm active:opacity-80 font-pixel",
    buttonText: "text-white text-center font-pixel",
    errorText: "text-error text-sm mb-4",
  },
  inicio: {
    container:
      "flex-1 bg-background font-pixel p-4 justify-center items-center",
    title: "text-secondary text-2xl",
  },

  layout: {
    screen: "flex-1 bg-background font-pixel p-4",
    centerAll: "flex-1 bg-background justify-center items-center p-4",

    row: "flex-row flex-wrap items-center",
    spaceBetween: "flex-row justify-between items-center w-full",

    col100: "w-full p-2", // 1 bloque (100%)
    col75: "w-3/4 p-2", // 3 bloques (75%)
    col66: "w-2/3 p-2", // 2 tercios (66.6%)
    col50: "w-1/2 p-2", // Mitad (50%)
    col33: "w-1/3 p-2", // 1 tercio (33.3%)
    col25: "w-1/4 p-2", // 1 cuarto (25%)
  },

  ui: {
    // Títulos
    titleMain: "text-primary text-3xl font-pixel text-center my-4",
    titleSection: "text-secondary text-2xl font-pixel mb-2",

    // Formularios
    input:
      "w-full border-gray-300 rounded-lg px-4 py-3 mb-4 font-pixel bg-white border",
    label: "text-gray-700 font-pixel mb-1 ml-1 text-sm",

    // Botones
    btnPrimary:
      "bg-secondary w-full py-3 rounded-lg items-center shadow-md active:opacity-80",
    btnText: "text-white font-pixel text-lg text-center",

    // Feedback
    error: "text-error text-sm font-pixel text-center mb-4",
  },

  card: {
    touchable: "flex-1 m-1",
    container: "rounded-xl p-3 shadow-md bg-white/10 border border-white/20",
    imageBg:
      "bg-white/30 rounded-full w-24 h-24 self-center justify-center items-center",
    image: "w-20 h-20",
    infoContainer: "mt-2 items-center",
    id: "text-black/60 font-bold absolute top-2 right-2",
    name: "text-white text-lg font-bold capitalize font-pixel text-center",
    typePill: "px-3 py-1 bg-white/30 rounded-full mr-1",
  },



  drawer: {
    logoutBtn: "bg-error mr-4 px-3 py-1 rounded-md shadow-sm",
    text: "text-white font-pixel text-sm",
  },

  modal: {
    overlay: "flex-1 justify-center items-center bg-black/70",
    container: "w-11/12 h-5/6 rounded-2xl shadow-lg p-5",
    closeButton:
      "absolute top-4 right-4 bg-black/30 rounded-full w-8 h-8 justify-center items-center z-10",
    closeButtonText: "text-white font-bold text-base",

    header: "flex-row justify-between items-start",
    pokemonName: "text-white text-3xl font-bold capitalize font-pixel flex-1", // flex-1 para que el texto se ajuste
    pokemonId: "text-white/80 text-2xl font-bold font-pixel ml-2",

    imageBg:
      "self-center h-48 w-48 bg-white/20 rounded-full justify-center items-center my-2",
    image: "h-40 w-40",

    detailsContainer: "bg-white/15 rounded-xl p-4 mt-4",
    sectionTitle:
      "text-white text-xl font-pixel mb-3 pb-2 border-b border-white/20",

    statRow: "flex-row items-center mb-2",
    statLabel: "w-2/5 text-white font-pixel text-sm capitalize",
    statValue: "w-1/6 text-white font-pixel font-bold text-base",
    statBarContainer: "flex-1 h-3 bg-black/30 rounded-full",
    statBar: "h-full rounded-full border border-white/50",

    abilityContainer: "mb-3",
    abilityName: "text-white font-pixel text-base capitalize mb-1",
    abilityDescription: "text-white/80 text-sm italic",
  },

  login: { container: "flex-1 bg-background p-4 justify-center items-center" },
  register: {
    container: "flex-1 bg-background p-4 justify-center items-center",
  },

  perfil: {
    container: "flex-1 my-4",
    iconPerfil1:
      " bg-neutral-300  w-[9rem] h-[9rem] rounded-full items-center justify-center ",
    containerOpciones: "items-center justify-center ",
    fotoContainer: " bg-sky-200 w-[8rem] h-[8rem] self-center rounded-full",
    foto: "w-full h-full ",
    editIcon: "w-7 h-7 absolute bottom-0 right-0",
    opciones: "mt-8 justify-center items-center",
    vistaOpciones: "flex-column gap-6 my-8",
    vistaEditarAtributo: "flex-row items-center ",
  },

  modalInput: {
    overlay: "flex-1 justify-center items-center bg-black/70",

    container: "w-[85%] bg-white rounded-lg p-4",

    title: "text-lg font-bold mb-3",

    input: "border border-gray-300 rounded-md p-2 mb-4",

    actions: "flex-row justify-end gap-4",

    cancel: "text-gray-500",

    confirm: "text-blue-600 font-bold",

    error: "mb-3 p-1 text-red-600 text-left"
  },

  app: {
    container: "flex-1 bg-background font-pixel",
    title: "text-primary text-3xl font-pixel text-center my-4",
  },


  movementCard: {
    containerCard: "items-center rounded-xl overflow-hidden shadow-md flex-row gap-2 my-2 bg-gray-300",
    containerId: "bg-neutral-800 self-stretch w-10  justify-center items-center py-4",
    id: "bold text-lg text-neutral-200",
    iconCategory: "w-10 h-10 mr-2",
    name: "m-2 capitalize flex-[4] font-bold text-lg ",
    type: "flex-[2] capitalize text-center text-white font-pixel font-bold px-1 py-1 mr-2 rounded-lg",
    containerInfo: "flex-1 flex-row items-center justify-between gap-2 h-full ",
  },

  movementLayout: {
    container: "flex-row justify-between ",
    
  },

  team: {
    itemContainer: "bg-white p-4 rounded-lg shadow-md mb-3",
  },
};

module.exports = styles;
