import { CONFIG } from '../constants/config';


export const apiRequest = async (endpoint, options = {}) => {
  const url = `${CONFIG.API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      const errorMsg = `Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMsg);
    }

    return await response.json();
  } catch (error) {
    console.error("Fallo de red o servidor:", error);
    throw error;
  }
};