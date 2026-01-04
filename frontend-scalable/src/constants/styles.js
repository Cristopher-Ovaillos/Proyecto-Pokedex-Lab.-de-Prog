

const styles = {
    home: {
        container: "flex-1 bg-background font-pixel p-4 justify-center items-center",
        title: "text-primary text-2xl mb-2",
        subtitle: "text-textMain text-center mb-6",
        configBox: "bg-gray-100 p-3 rounded w-full mb-4",
        configLabel: "text-xs text-gray-500 font-pixel mb-1",
        configValue: "text-xs text-gray-600",
        button: "bg-secondary px-6 py-3 rounded-lg shadow-sm active:opacity-80",
        buttonText: "text-white font-pixel",
    },
    login: {
        container: "flex-1 bg-background  p-4 justify-center items-center",
        title: "text-primary text-2xl font-pixel",
        input: "w-full border-gray-300 rounded px-4 py-2 mb-4 font-pixel",
        button: "bg-secondary w-full py-3 rounded-lg shadow-sm active:opacity-80 font-pixel",
        buttonText: "text-white text-center font-pixel font-pixel",
        errorText: "text-error text-sm mb-4",

    },
    register: {
        container: "flex-1 bg-background  p-4 justify-center items-center",
        title: "text-primary text-2xl font-pixel",
        input: "w-full border-gray-300 rounded px-4 py-2 mb-4 font-pixel",
        button: "bg-secondary w-full py-3 rounded-lg shadow-sm active:opacity-80 font-pixel",
        buttonText: "text-white text-center font-pixel font-pixel",
        errorText: "text-error text-sm mb-4",
    },
    inicio: {
        container: "flex-1 bg-background font-pixel p-4 justify-center items-center",
        title: "text-secondary text-2xl",
    },
    pokedex: {
        container: "flex-1 bg-background p-2",
        title: "text-primary text-3xl font-pixel text-center my-4",
        searchContainer: "px-2 py-1",
        searchInput: "bg-white h-12 px-5 rounded-full text-base border border-gray-300 font-pixel",
        filtersContainer: "p-2",
        filterButton: "bg-light p-3 rounded-xl shadow-sm self-center",
        filterButtonText: "text-dark text-base font-pixel",
        list: "w-full",
        loadingText: "text-center text-gray-500 mt-4 font-pixel",
        errorText: "text-center text-error mt-4 font-pixel",
        row: "justify-between",
    },

    pokemonCard: {
        touchable: "flex-1 m-1",
        container: "rounded-xl p-3 shadow-md",
        imageContainer: "bg-white/30 rounded-full w-28 h-28 self-center justify-center items-center",
        image: "w-24 h-24",
        infoContainer: "mt-2 items-center",
        id: "text-black/60 font-bold",
        name: "text-white text-lg font-bold capitalize",
    },

    pokemonDetailModal: {
        overlay: "flex-1 justify-center items-center bg-black/60",
        container: "bg-white w-11/12 max-w-md rounded-2xl shadow-lg",
        header: "p-4 rounded-t-2xl items-center relative",
        closeButton: "absolute top-2 right-2 p-2 rounded-full bg-black/20",
        closeIcon: "text-white text-lg",
        image: "w-40 h-40",
        id: "text-white/80 font-bold text-lg",
        name: "text-white text-3xl font-bold capitalize text-shadow-md",
        typeBadge: "px-3 py-1 rounded-full mr-2",
        typeBadgeText: "text-white font-bold capitalize",
        typeContainer: "flex-row mt-2",
        content: "p-4",
        sectionTitle: "text-xl font-bold text-dark mt-4 mb-2",
        statRow: "flex-row items-center my-1",
        statName: "w-1/4 font-bold text-gray-600",
        statValue: "w-1/6 font-bold text-right",
        statBar: "w-7/12 h-4 rounded-full",
        statBarFill: "h-4 rounded-full",
        infoRow: "flex-row justify-around mt-4",
        infoBlock: "items-center",
        infoLabel: "text-gray-500",
        infoValue: "font-bold text-lg",
    },

    filterModal: {
        centeredView: "flex-1 justify-end bg-black/50",
        modalView: "bg-white w-full rounded-t-2xl p-5 shadow-lg max-h-[80%]",
        title: "text-2xl font-pixel mb-4",
        sectionTitle: "text-lg font-pixel mt-4 mb-2 text-gray-700",
        typeContainer: "flex-row flex-wrap",
        typeButton: "px-4 py-2 rounded-full m-1 border-2",
        typeButtonSelected: "border-primary",
        typeButtonUnselected: "border-gray-200",
        typeText: "font-pixel capitalize",
        sortContainer: "flex-row flex-wrap",
        sortButton: "bg-gray-200 p-3 rounded-lg m-1",
        sortButtonSelected: "bg-primary",
        sortText: "font-pixel",
        sortTextSelected: "text-white",
        applyButton: "bg-primary mt-6 py-4 rounded-lg",
        applyButtonText: "text-white text-center font-pixel text-lg",
    },

    movimientos: {
        container: "flex-1 bg-background font-pixel p-4 justify-center items-center",
        title: "text-info text-2xl",
    },
    perfil: {
        container: "flex-1 bg-background font-pixel p-4 justify-center items-center",
        title: "text-dark text-2xl",
    },
    crearEquipo: {
        container: "flex-1 bg-background font-pixel p-4 justify-center items-center",
        title: "text-success text-2xl",
    },

    drawer: {
        logoutButton: "bg-error mr-4 px-3 py-1 rounded-md",
        logoutButtonText: "text-white font-pixel text-sm",
        drawerLabel: "font-pixel",
    },
};

module.exports = styles;