import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { API_URL } from '../config';

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenService = {
    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    getRefreshToken: () => {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    setTokens: (access, refresh) => {
        localStorage.setItem(TOKEN_KEY, access);
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    },

    removeTokens: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },

    isTokenExpired: (token) => {
        try {
            const decoded = jwtDecode(token);
            const expirationTime = decoded.exp * 1000;
            const currentTime = Date.now() + 30000; // добавляем 30 секунд буфера
            console.log('Проверка срока действия токена:', {
                expirationTime: new Date(expirationTime).toISOString(),
                currentTime: new Date(currentTime).toISOString(),
                isExpired: expirationTime < currentTime
            });
            return expirationTime < currentTime;
        } catch (error) {
            console.error('Ошибка при проверке срока действия токена:', error);
            return true;
        }
    },

    getTokenExpirationTime: (token) => {
        try {
            const decoded = jwtDecode(token);
            const expirationTime = decoded.exp * 1000;
            console.log('Время истечения токена:', new Date(expirationTime).toISOString());
            return expirationTime;
        } catch (error) {
            console.error('Ошибка при получении времени истечения токена:', error);
            return 0;
        }
    },

    refreshToken: async () => {
        try {
            const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
            if (!refreshToken) {
                throw new Error('No refresh token');
            }

            const response = await axios.post(`${API_URL}/api/token/refresh/`, {
                refresh: refreshToken
            });

            const { access, refresh } = response.data;
            localStorage.setItem(TOKEN_KEY, access);
            localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
            return access;
        } catch (error) {
            console.error('Ошибка при обновлении токена:', error);
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            throw error;
        }
    }
}; 