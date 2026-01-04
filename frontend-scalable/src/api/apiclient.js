// src/api/apiclient.js
import { ENV } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = ENV.API_URL;
/*
cuando iniciamos sesion, generamos el token
*/

async function request(path, { method='GET', body, headers={}, ...rest } = {}) {
  const baseHeaders = { 'Content-Type': 'application/json' };
  const token = await AsyncStorage.getItem('token');
  if (token) baseHeaders.Authorization = `Bearer ${token}`;
  Object.assign(baseHeaders, headers);

  const options = { method, headers: baseHeaders, ...rest };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(BASE_URL + path, options);
  const contentType = res.headers.get('content-type');
  const data = contentType?.includes('application/json') ? await res.json() : await res.text();
  if (!res.ok) throw { status: res.status, data };
  return data;
}

export default {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};