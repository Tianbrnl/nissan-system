import axios from 'axios';

const API_URL =
    import.meta.env.VITE_BACKEND_URL ||
    (import.meta.env.DEV ? 'http://localhost:8000' : '');

if (!API_URL) {
    throw new Error('Missing VITE_BACKEND_URL');
}

export const api = axios.create({
    baseURL: API_URL,
});

export const authApi = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});
