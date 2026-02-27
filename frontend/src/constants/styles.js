const styles = {
  // https://lenguajecss.com/css/posicionamiento/position-absolute/
  // https://lenguajecss.com/css/posicionamiento/position-absolute/ absolute toma del padre, el padre debe ser position relative
  //react antive por defecto es flexbox y column direction 
  layout: {
    screen: "flex-1 bg-background",
    centerAll: "flex-1 bg-background justify-center items-center p-4",

    row: "flex-row flex-wrap items-center",
    spaceBetween: "flex-row justify-between items-center w-full",

    col100: "w-full p-2",       // 1 bloque (100%)
    col75: "w-3/4 p-2",        // 3 bloques (75%)
    col66: "w-2/3 p-2",        // 2 tercios (66.6%)
    col50: "w-1/2 p-2",        // Mitad (50%)
    col33: "w-1/3 p-2",        // 1 tercio (33.3%)
    col25: "w-1/4 p-2",        // 1 cuarto (25%)
  },

  ui: {
    // Títulos
    titleMain: "text-primary text-lg font-pixel text-center my-4",
    titleSection: "text-secondary text-md font-pixel mb-2 text-center",

    // Formularios
    input: "w-[95%]  self-center border-gray-300 rounded-lg px-4 py-3 mb-4 font-pixel bg-white border text-sm",
    label: "text-gray-700 font-pixel mb-1 ml-1 text-sm",

    // Botones
    btnPrimary: "bg-secondary w-[95%] self-center py-3 rounded-lg items-center shadow-md active:opacity-80",
    btnText: "text-white  font-pixel text-lg text-center",

    // Feedback
    error: "text-error text-sm font-pixel text-center mb-4",
  },

  card: {
    touchable: " m-1",
    container: "rounded-xl p-3 flex-row shadow-md bg-white/10 border items-stretch border-white/20 justify-center items-center",
    imageBg: "bg-black/20 p-1 border-black/20 rounded-xl  self-center justify-center items-center",
    image: "w-24 h-24 rounded-xl p-4",
    infoContainer: "ml-2 flex-col flex-1  items-start justify-between gap-4 p-2",
    imagenContainer: "p-4 bg-white rounded-xl",
    id: "ml-1  font-bold text-lg text-emerald-800 ",
    name: "ml-1 text-white text-md capitalize font-pixel text-center text-white-600",
    typePill: "px-3 py-2 bg-black/20 rounded-lg ",
    typeContainer: "flex-row gap-2 justify-start"
  },

  drawer: {
    drawerLabel: "text-white font-pixel text-xs",
    logoutBtn: "bg-error mr-4 px-3 py-1 rounded-md shadow-sm",
    text: "text-white font-pixel text-xs",
  },

  modal: {
    overlay: "flex-1 justify-center items-center bg-black/70",
    container: "w-11/12 h-5/6 rounded-2xl shadow-lg p-5",
    closeButton: "absolute top-4 right-4 bg-black/30 rounded-full w-8 h-8 justify-center items-center z-10",
    closeButtonText: "text-white font-bold text-base",

    header: "flex-row justify-between items-start py-2 ",
    pokemonName: "text-white text-xl  capitalize font-pixel flex-1", // flex-1 para que el texto se ajuste
    pokemonId: "text-white/80 text-2xl font-bold font-pixel ml-2",

    imageBg: "self-center p-2 bg-black/20 rounded-full justify-center items-center my-2",
    image: "h-40 w-40 rounded-3xl",
    containerImg: "p-6 bg-white rounded-full",

    detailsContainer: "bg-white/15 rounded-xl p-4 mt-4",
    sectionTitle: "text-white text-xl font-pixel mb-3 pb-2 border-b border-white/20",

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
  register: { container: "flex-1 bg-background p-4 justify-center items-center" },
  app: { container: "flex-1 bg-background font-pixel", title: "text-primary text-3xl font-pixel text-center my-4" },

  team: {
    btnTeam: "bg-secondary w-full items-center p-5 rounded-lg",
    cardTeam: "w-full p-6 bg-primary rounded-xl mb-2",
    itemContainer: "bg-white p-4 rounded-lg shadow-md mb-3",
  },

  teamBuilder: {
    slotContainer: "flex-row flex-wrap justify-center mb-5",
    slot: "w-24 h-24 rounded-lg bg-white/10 justify-center items-center m-1 border-2 border-dashed border-white/20",
    slotPokemonImage: "w-20 h-20",
    slotPokemonName: "text-white text-xs font-pixel text-center absolute bottom-1",

    teamListContainer: "mt-5",
    teamCard: "bg-white/10 p-4 rounded-lg mb-3",
    teamCardHeader: "flex-row justify-between items-center",
    teamCardName: "text-white front-pixel text-lg",
    teamCardDate: "text-white/70 text-sm mt-1",
    teamCardPokemons: "flex-row mt-3 ",
    teamCardPokemonImage: "w-10 h-10 rounded-full bg-black/20 mr-2 border-2 border-white/20",
    slotBtnEdit: "mt-1 p-1 bg-gray-700 rounded mx-1",
    slotBtnEditText: "text-white text-[10px] text-center",
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
  modalMovement: {
    overlay: "flex-1 bg-black/70 items-center justify-center",
    container: "w-11/12 h-5/6 bg-emerald-400 rounded-2xl shadow-lg px-2 py-1",
    header: "flex-row justify-between items-center py-2",
    cerrarBotton: "absolute top-0 right-0 bg-black/15 rounded-full w-8 h-8 justify-center items-center z-10 m-5",
    closeButtonText: "text-white font-bold text-sm ",
    texto: "capitalize text-lg font-bold text-white",
    titulo: "text-3xl font-bold",
    infoBasica: "my-3 bg-emerald-200/60 p-4 rounded-xl gap-2",
    infoBasicaText: "text-white text-2xl font-bold border-b border-white py-1 ",
    typeContainer: "flex-row gap-3 justify-start my-2 ",
    type: " capitalize text-center text-white font-bold px-1 py-1 rounded-lg",
    categoryContainer: "flex-row gap-4 justify-start mt-2",
    iconCategory: "w-8 h-8 ",
    statRow: "flex-row items-center mb-2",
    statLabel: "w-2/5 text-white  text-lg  font-bold capitalize",
    statValue: "w-1/6 text-white text-lg font-bold text-base",
    statBarContainer: "flex-1 h-3 bg-black/30 rounded-full",
    statBar: "h-full rounded-full border border-white/50",
    descripcion: "italic text-md my-2",
    cardPoke: "p-4 border border-black mb-1 flex-row gap-3 bg-emerald-200/60 rounded-lg justify-start items-center",
    imagePokemonContainer: "w-15 h-15 items-center justify-center bg-white rounded-lg p-2 border border-black",
    infoPoke: "flex-col flex-1 items-center"
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

  moveSelectionModal: {
    overlay: "flex-1 bg-black/70 justify-center p-5",
    content: "bg-gray-800 rounded-xl max-h-[80%] pb-5",
    header: "flex-row justify-between items-center p-4 border-b border-gray-700",
    title: "text-white text-lg font-bold",
    moveItem: "flex-row items-center p-3 my-1 bg-gray-700 rounded-lg border border-transparent",
    selectedMoveItem: "bg-gray-600",
    moveName: "text-base font-bold",
    moveType: "text-gray-400 text-xs",
    confirmButton: "bg-blue-500 p-4 m-4 rounded-lg items-center",
    confirmText: "text-white font-bold text-base",
  },
};

module.exports = styles;