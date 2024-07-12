import { EventEmitter } from 'events';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const authService = new EventEmitter();
const TOKEN_KEY = 'authToken';

authService.login = async (username, password) => {
    try {
        const response = await axios.post('/api/auth/login', { username, password });

        const decodedToken = jwt_decode(response.data.token);
        if (!decodedToken.userId || !decodedToken.role) {
            throw new Error('Invalid token payload');
        }

        localStorage.setItem(TOKEN_KEY, response.data.token);
        authService.emit('login', decodedToken.role);
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : 'An error occurred during login';
        console.error('Login error:', errorMessage);
        authService.emit('loginError', errorMessage);
        throw new Error(errorMessage);
    }
};

authService.logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    authService.emit('logout');
};

authService.isAuthenticated = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;
    try {
        const decodedToken = jwt_decode(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp > currentTime;
    } catch (error) {
        console.error('Error decoding token:', error);
        return false;
    }
};

authService.getUserRole = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    try {
        const decodedToken = jwt_decode(token);
        if (decodedToken && decodedToken.role) {
            return decodedToken.role;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

authService.register = async (username, password, role) => {
    try {
        const response = await axios.post('/api/auth/register', { username, password, role });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'An error occurred during registration';
        console.error('Registration error:', errorMessage);
        throw new Error(errorMessage);
    }
};

export default authService;
