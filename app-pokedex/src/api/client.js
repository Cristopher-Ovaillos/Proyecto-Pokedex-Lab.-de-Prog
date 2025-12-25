const variables = require('./config');

const URL = variables.BASE_URL;

// recordad como funciona node.js, es mono hilo debemos hacer de forma asicrona.
//usamos option = {} para esperar cualquier tipo de peticion.
export const apiClient = async (endpoint, option = {}) =>{

    //definimos los header por defecto porque en la v1 no hay auth, middleware ni naa
    const headerDefault = {
        'Content-Type': 'application/json', //  esto indica el tipo de medio del recurso
        'Accept': 'application/json', // informa al server sobre los diferentes tipos de datos que pueden enviarse de vuetla. 
    };
    //spread operator (hace fusion)

    const config = {
        ...option,
        headers: {
            ...headerDefault,
            ...option.headers,
        },
    };

    try {
        //peticion generica
        const response = await fetch(`${URL}${endpoint}`, config);

        //manejo de errores.
        if (!response.ok) {
            const err = await response.json.catch(()=>{});
            throw new Error(err.message);
            
        }

        //exito
        return await response.json();

    } catch (err) {
        console.err("[API error]: ", err.message )
        throw err;
    }

}