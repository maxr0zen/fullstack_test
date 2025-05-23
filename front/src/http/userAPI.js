import { $host, $authHost } from "./index"
import { tokenService } from "../utils/tokenService"

export const registration = async (username, email, password, password2) => {  
    console.log('Registration data:', { username, email, password, password2 });
    const { data } = await $host.post('api/register/', {
        username,
        email,
        password,
        password2
    });
    console.log('Registration response:', data);
    return data;
}

export const login = async (username, password) => {
    console.log('Отправка запроса на авторизацию:', { username, password });
    try {
        const requestData = { username, password };
        console.log('Данные запроса:', JSON.stringify(requestData));
        
        const response = await $host.post('api/token/', requestData, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        console.log('Получен ответ от сервера:', response.data);
        console.log('Статус ответа:', response.status);
        console.log('Заголовки ответа:', response.headers);
        
        tokenService.setTokens(response.data.access, response.data.refresh);
        return response.data;
    } catch (error) {
        console.error('Детали ошибки авторизации:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            requestData: { username, password: '***' },
            headers: error.response?.headers
        });
        throw error;
    }
}

export const check = async () => {
    const { data } = await $authHost.get('api/token/verify/')
    return data
}

export const logout = () => {
    tokenService.removeTokens()
}

export const refreshToken = async (refresh) => {
    const response = await $host.post('api/token/refresh/', {refresh})
    return response.data
}









