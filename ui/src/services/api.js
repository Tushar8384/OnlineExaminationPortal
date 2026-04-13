import axios from 'axios';

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    // Prefer env-configured URL; fallback matches current backend default run port.
    baseURL: configuredBaseUrl || 'http://localhost:8081/api',
    timeout: 10000,
});

// This automatically attaches your JWT token to every request after you log in
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
