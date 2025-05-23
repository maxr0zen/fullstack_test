import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { useAuth } from '../contexts/AuthContext';
import { 
    Container, 
    Typography, 
    Box, 
    Card, 
    CardMedia, 
    Button, 
    Rating,
    Grid,
    Divider,
    Paper
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import Comments from '../components/Comments/Comments';

const ProductImage = ({ image, name }) => {
    const [imageError, setImageError] = useState(false);

    if (imageError || !image) {
        return (
            <Box
                sx={{
                    aspectRatio: '1/1',
                    width: '100%',
                    maxWidth: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8f9fa',
                    borderRadius: 2,
                    p: 2,
                    color: 'text.secondary',
                    mx: 'auto'
                }}
            >
                <ImageIcon sx={{ fontSize: 80, mb: 2, opacity: 0.5 }} />
                <Typography variant="body1" align="center">
                    Изображение отсутствует
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                aspectRatio: '1/1',
                width: '100%',
                maxWidth: 400,
                mx: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8f9fa',
                borderRadius: 2,
                overflow: 'hidden'
            }}
        >
            <CardMedia
                component="img"
                sx={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
                image={image}
                alt={name}
                onError={() => setImageError(true)}
            />
        </Box>
    );
};

const ProductDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const loadProduct = useCallback(async () => {
        try {
            const data = await productService.getProduct(id);
            console.log('Полученные данные продукта:', data);
            setProduct(data);
        } catch (err) {
            console.error('Ошибка при загрузке продукта:', err);
            setError('Ошибка при загрузке продукта');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadProduct();
    }, [loadProduct]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography>Загрузка...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    if (!product) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography>Продукт не найден</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Card 
                            elevation={0}
                            sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'transparent',
                                borderRadius: 2
                            }}
                        >
                            <ProductImage 
                                image={product.image} 
                                name={product.name}
                            />
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                                {product.name}
                            </Typography>
                            <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
                                {product.price} ₽
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Rating 
                                    value={product.average_rating} 
                                    readOnly 
                                    precision={0.5}
                                    size="large"
                                />
                                <Typography variant="body1" sx={{ ml: 1, color: 'text.secondary' }}>
                                    ({product.comments?.length || 0} отзывов)
                                </Typography>
                            </Box>
                            <Typography 
                                variant="body1" 
                                paragraph 
                                sx={{ 
                                    mb: 3,
                                    color: 'text.secondary',
                                    lineHeight: 1.7
                                }}
                            >
                                {product.description}
                            </Typography>
                            {user && (
                                <Button 
                                    variant="contained" 
                                    color="primary"
                                    size="large"
                                    onClick={() => productService.toggleFavorite(product.id)}
                                    sx={{ 
                                        mt: 'auto',
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    {product.is_favorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                                </Button>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ 
                        fontWeight: 600,
                        mb: 3
                    }}
                >
                    Отзывы и комментарии
                </Typography>
                <Comments productId={product.id} />
            </Paper>
        </Container>
    );
};

export default ProductDetail; 