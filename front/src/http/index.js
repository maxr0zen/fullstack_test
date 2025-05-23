import axios from "axios";
import { tokenService } from '../utils/tokenService';
import { API_URL } from '../config';


export const $host = axios.create({
    baseURL: API_URL
});


export const $authHost = axios.create({
    baseURL: API_URL
});


let isRefreshing = false;

let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Функция для обновления токена
const refreshToken = async () => {
    try {
        console.log('Начало обновления токена');
        const refreshToken = tokenService.getRefreshToken();
        console.log('Получен refresh token:', refreshToken ? 'есть' : 'отсутствует');
        
        if (!refreshToken) {
            console.error('Refresh token отсутствует');
            throw new Error('No refresh token');
        }

        console.log('Отправка запроса на обновление токена');
        const response = await $host.post('api/token/refresh/', {
            refresh: refreshToken
        });
        console.log('Получен ответ на обновление токена:', response.data);

        const { access, refresh } = response.data;
        tokenService.setTokens(access, refresh);
        console.log('Токены обновлены и сохранены');
        return access;
    } catch (error) {
        console.error('Ошибка при обновлении токена:', error.response?.data || error.message);
        tokenService.removeTokens();
        throw error;
    }
};

// Добавляем интерцептор для авторизованных запросов
$authHost.interceptors.request.use(
    async (config) => {
        const token = tokenService.getToken();
        console.log('Проверка токена в интерцепторе запроса:', token ? 'есть' : 'отсутствует');
        
        if (token) {
            const isExpired = tokenService.isTokenExpired(token);
            console.log('Токен истек:', isExpired);
            
            if (isExpired) {
                console.log('Токен истек, начинаем обновление');
                if (!isRefreshing) {
                    isRefreshing = true;
                    try {
                        const newToken = await refreshToken();
                        config.headers.Authorization = `Bearer ${newToken}`;
                        processQueue(null, newToken);
                    } catch (error) {
                        console.error('Ошибка при обновлении токена в интерцепторе:', error);
                        processQueue(error, null);
                        throw error;
                    } finally {
                        isRefreshing = false;
                    }
                } else {
                    console.log('Токен уже обновляется, добавляем запрос в очередь');
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then(token => {
                        config.headers.Authorization = `Bearer ${token}`;
                        return config;
                    }).catch(err => {
                        return Promise.reject(err);
                    });
                }
            } else {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        console.error('Ошибка в интерцепторе запроса:', error);
        return Promise.reject(error);
    }
);

// Добавляем интерцептор для ответов
$authHost.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Если ошибка 401 и это не запрос на обновление токена
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Если токен уже обновляется, добавляем запрос в очередь
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return $authHost(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshToken();
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                processQueue(null, newToken);
                return $authHost(originalRequest);
            } catch (error) {
                processQueue(error, null);
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);