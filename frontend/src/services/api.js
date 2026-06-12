import axios from 'axios';
import toast from 'react-hot-toast';

// Utiliser le chemin relatif pour que le proxy Nginx fonctionne
// En développement local : Vite proxy
// En production Docker : Nginx proxy
const baseURL = '/api';

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 30000
});

// Request interceptor for token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            toast.error('Session expired, please login again');
        } else if (error.response?.status === 429) {
            toast.error('Too many requests, please try again later');
        } else if (error.response?.data?.message) {
            toast.error(error.response.data.message);
        } else if (error.code === 'ERR_NETWORK') {
            toast.error('Cannot connect to server. Please check if backend is running.');
        }
        return Promise.reject(error);
    }
);

export default api;