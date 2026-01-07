// src/api/apiclient.js
import { ENV } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = ENV.API_URL;

// funcion principal para realizar peticiones a la api
async function request(path, { method = 'GET', body, headers = {}, ...rest } = {}) {
    // configura las cabeceras base
    const baseHeaders = { 'Content-Type': 'application/json' };
    
    // obtiene el token de autenticacion y lo anade a las cabeceras si existe
    const token = await AsyncStorage.getItem('token');
    if (token) {
        baseHeaders.Authorization = `Bearer ${token}`;
    }
    Object.assign(baseHeaders, headers);

    const options = { method, headers: baseHeaders, ...rest };
    if (body) {
        options.body = JSON.stringify(body);
    }

    // implementa un sistema de timeout para las peticiones
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ENV.TIMEOUT || 15000);
    options.signal = controller.signal;

    try {
        // ejecuta la peticion fetch
        const res = await fetch(BASE_URL + path, options);
        // limpia el timeout si la peticion es exitosa
        clearTimeout(timeoutId);

        // procesa la respuesta
        const contentType = res.headers.get('content-type');
        const data = contentType?.includes('application/json') ? await res.json() : await res.text();
        
        // si la respuesta no es 'ok', lanza un error
        if (!res.ok) {
            throw { status: res.status, data };
        }
        return data;
    } catch (error) {
        // si el error es por timeout, lanza un error especifico
        if (error.name === 'AbortError') {
            throw { status: 408, data: 'La petición ha tardado demasiado.' };
        }
        // relanza otros errores
        throw error;
    }
}

// exporta metodos de conveniencia para get, post, put, delete
export default {
    get: (path, opts) => request(path, { ...opts, method: 'GET' }),
    post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
    put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
    delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};
