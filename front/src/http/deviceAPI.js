import { $host, $authHost } from "./index";

export const fetchProducts = async () => {
    const { data } = await $host.get('api/products/');
    return data;
};

export const fetchOneProduct = async (id) => {
    const { data } = await $host.get('api/products/' + id);
    return data;
};

export const getFavorites = async () => {
    try {
        console.log('Запрос на получение избранного');
        const { data } = await $authHost.get('api/favorites/');
        console.log('Получены данные избранного:', data);
        // Получаем информацию о каждом товаре
        const favoritesWithProducts = await Promise.all(
            data.results.map(async (favorite) => {
                try {
                    console.log('Получение информации о товаре:', favorite);
                    const productData = await fetchOneProduct(favorite.product);
                    return {
                        ...favorite,
                        product: productData
                    };
                } catch (error) {
                    console.error(`Ошибка при получении информации о товаре ${favorite.product}:`, error);
                    return favorite;
                }
            })
        );
        console.log('Обработанные данные избранного:', favoritesWithProducts);
        return {
            ...data,
            results: favoritesWithProducts
        };
    } catch (error) {
        console.error('Ошибка при получении избранного:', error);
        throw error;
    }
};

export const addToFavorites = async (productId) => {
    try {
        console.log('Отправка запроса на добавление в избранное:', { product: productId });
        const { data } = await $authHost.post('api/favorites/', { product: productId });
        console.log('Ответ сервера:', data);
        // Получаем информацию о товаре
        const productData = await fetchOneProduct(productId);
        return {
            ...data,
            product: productData
        };
    } catch (error) {
        console.error('Ошибка при добавлении в избранное:', error.response?.data || error.message);
        throw error;
    }
};

export const removeFromFavorites = async (favoriteId) => {
    try {
        console.log('Отправка запроса на удаление из избранного:', favoriteId);
        const { data } = await $authHost.delete(`api/favorites/${favoriteId}/`);
        console.log('Ответ сервера при удалении:', data);
        return data;
    } catch (error) {
        console.error('Ошибка при удалении из избранного:', error.response?.data || error.message);
        throw error;
    }
}; 