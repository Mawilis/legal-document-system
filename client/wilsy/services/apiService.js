import axios from 'axios';
import authService from './authService';
import { toast } from 'react-toastify'; // Import for user-friendly notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS


const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '/api',
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    response => response,
    error => {
        const errorMessage = error.response?.data?.message || 'An error occurred';
        toast.error(errorMessage);
        if (error.response && error.response.status === 401) {
            authService.logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

