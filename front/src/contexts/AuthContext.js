import React, { createContext, useContext, useState, useEffect } from 'react';
import { $authHost, $host } from '../http/index';
import { tokenService } from '../utils/tokenService';
import { login as loginAPI } from '../http/userAPI';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshTokens = async () => {
        try {
            console.log('Начало обновления токенов');
            const refreshToken = tokenService.getRefreshToken();
            
            if (!refreshToken) {
                console.log('Refresh token отсутствует');
                throw new Error('No refresh token');
            }

            const response = await $host.post('/api/token/refresh/', {
                refresh: refreshToken
            });

            const { access, refresh } = response.data;
            tokenService.setTokens(access, refresh);
            console.log('Токены успешно обновлены');
            return access;
        } catch (error) {
            console.error('Ошибка при обновлении токенов:', error);
            tokenService.removeTokens();
            setUser(null);
            throw error;
        }
    };

    const fetchUserData = async () => {
        try {
            console.log('Начало загрузки данных пользователя');
            let token = tokenService.getToken();
            
            if (!token) {
                console.log('Токен отсутствует, выход из системы');
                setUser(null);
                return;
            }

            // Проверяем срок действия токена
            if (tokenService.isTokenExpired(token)) {
                console.log('Токен истек, пытаемся обновить');
                try {
                    token = await refreshTokens();
                } catch (error) {
                    console.error('Не удалось обновить токен:', error);
                    setUser(null);
                    return;
                }
            }

            const response = await $authHost.get('/api/users/me/');
            console.log('Получены данные пользователя:', response.data);
            
            if (response.data) {
                setUser(response.data);
                console.log('Данные пользователя установлены в контекст');
            } else {
                console.error('Получены пустые данные пользователя');
                setUser(null);
            }
        } catch (error) {
            console.error('Ошибка при получении данных пользователя:', error);
            
            if (error.response?.status === 401) {
                console.log('Токен невалиден, пытаемся обновить');
                try {
                    await refreshTokens();
                    // Повторяем запрос после обновления токена
                    const response = await $authHost.get('/api/users/me/');
                    setUser(response.data);
                } catch (refreshError) {
                    console.error('Не удалось обновить токен:', refreshError);
                    tokenService.removeTokens();
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            console.log('Инициализация авторизации');
            const token = tokenService.getToken();
            
            if (token) {
                if (tokenService.isTokenExpired(token)) {
                    try {
                        await refreshTokens();
                    } catch (error) {
                        console.error('Не удалось обновить токен при инициализации:', error);
                        setUser(null);
                        setLoading(false);
                        return;
                    }
                }
                await fetchUserData();
            } else {
                console.log('Токен отсутствует, пользователь не авторизован');
                setUser(null);
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (username, password) => {
        try {
            console.log('Начало процесса входа в AuthContext');
            // Получаем токены через userAPI
            const { access, refresh } = await loginAPI(username, password);
            console.log('Токены получены успешно:', { access: access ? 'есть' : 'нет', refresh: refresh ? 'есть' : 'нет' });
            
            // Сохраняем токены
            tokenService.setTokens(access, refresh);
            console.log('Токены сохранены в localStorage');
            
            // Получаем данные пользователя
            try {
                console.log('Попытка получить данные пользователя');
                const response = await $authHost.get('/api/users/me/', {
                    headers: {
                        'Authorization': `Bearer ${access}`
                    }
                });
                console.log('Данные пользователя получены:', response.data);
                setUser(response.data);
            } catch (userError) {
                console.error('Ошибка при получении данных пользователя:', {
                    status: userError.response?.status,
                    data: userError.response?.data,
                    message: userError.message
                });
                // Даже если не удалось получить данные пользователя, 
                // мы все равно считаем вход успешным, так как токены получены
                setUser({ username }); // Устанавливаем базовую информацию о пользователе
            }
            
            return { access, refresh };
        } catch (error) {
            console.error('Ошибка при входе в AuthContext:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        }
    };

    const logout = () => {
        console.log('Выполняется выход из системы');
        tokenService.removeTokens();
        setUser(null);
        console.log('Данные пользователя очищены');
    };

    if (loading) {
        console.log('Загрузка контекста авторизации...');
        return null;
    }

    console.log('Текущее состояние пользователя:', user);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 