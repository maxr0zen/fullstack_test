import axiosInstance from './axiosConfig';
import { API_URL } from '../config';

const PRODUCT_API_URL = `${API_URL}/api/products`;

export const productService = {
    // Получить список всех продуктов
    getProducts: async () => {
        try {
            const response = await axiosInstance.get(PRODUCT_API_URL);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Получить продукт по ID
    getProduct: async (id) => {
        try {
            const response = await axiosInstance.get(`${PRODUCT_API_URL}/${id}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Добавить/удалить из избранного
    toggleFavorite: async (productId) => {
        try {
            const response = await axiosInstance.post(`${PRODUCT_API_URL}/${productId}/favorite/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}; 