import axiosInstance from './axiosConfig';
import { API_URL } from '../config';

const COMMENT_API_URL = `${API_URL}/api/comments`;

export const commentService = {
    // Получить комментарии для продукта
    getProductComments: async (productId) => {
        try {
            const response = await axiosInstance.get(`${COMMENT_API_URL}/?product_id=${productId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Добавить комментарий
    addComment: async (productId, commentData) => {
        try {
            const response = await axiosInstance.post(`${COMMENT_API_URL}/`, {
                product: productId,
                text: commentData.text,
                rating: commentData.rating
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Удалить комментарий
    deleteComment: async (commentId) => {
        try {
            await axiosInstance.delete(`${COMMENT_API_URL}/${commentId}/`);
            return true;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Обновить комментарий
    updateComment: async (commentId, commentData) => {
        try {
            const response = await axiosInstance.patch(`${COMMENT_API_URL}/${commentId}/`, commentData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}; 