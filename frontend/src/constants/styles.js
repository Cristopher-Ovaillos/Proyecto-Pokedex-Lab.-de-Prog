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

  app: {
    container: "flex-1 bg-background font-pixel",
    title: "text-primary text-3xl font-pixel text-center my-4",
  },

  card: {
    touchable: "flex-1 m-1",
    container: "bg-zinc-100 bg-sky-50 rounded-xl px-3 shadow-md border border-gray-400 items-center",
    imageContainer:
      "bg-white  p-20 w-24 h-24 self-center justify-center items-center rounded-xl border-neutral-400 border-[1.5px]",
    image: "w-20 h-20",
    infoContainer: "mt-2 items-center",
    id: "text-emerald-400  p-1 font-bold self-start",
    name: "text-emerald-400 text-xl py-1 font-bold capitalize font-pixel ",
    typeContainer: "flex flex-row gap-3 justify-center mt-2 mb-2",
    typePill: "px-3 py-1 bg-white  mr-1",
    typeText: "text-white text-xs font-bold capitalize",
  },
  list: {
    container: "px-2",
    footer: "p-4",
  },

  movimientos: {
    container:
      "flex-1 bg-background font-pixel p-4 justify-center items-center",
    title: "text-info text-2xl",
  },
  perfil: {
    container:
      "flex-1 bg-background font-pixel p-4 justify-center items-center",
    title: "text-dark text-2xl",
  },
  crearEquipo: {
    container:
      "flex-1 bg-background font-pixel p-4 justify-center items-center",
    title: "text-success text-2xl",
  },

  drawer: {
    logoutButton: "bg-error mr-4 px-3 py-1 rounded-md",
    logoutButtonText: "text-white font-pixel text-sm",
    drawerLabel: "font-pixel",
  },
 
};

module.exports = styles;
