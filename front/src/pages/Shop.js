import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { fetchProducts, addToFavorites, getFavorites, removeFromFavorites } from "../http/deviceAPI";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { DEVICE_ROUTE } from "../utils/consts";
import { useAuth } from "../hooks/useAuth";
import SideBar from "../components/SideBar";
import { Rating, Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const Shop = observer(() => {
    const [products, setProducts] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [productsData, favoritesData] = await Promise.all([
                    fetchProducts(),
                    user ? getFavorites() : Promise.resolve([])
                ]);
                console.log('Полученные данные избранного:', favoritesData);
                setProducts(productsData.results || productsData);
                setFavorites(favoritesData.results || favoritesData);
                console.log('Установленное состояние избранного:', favoritesData.results || favoritesData);
                setLoading(false);
            } catch (e) {
                console.error('Ошибка при загрузке данных:', e);
                setError(e.message);
                setLoading(false);
            }
        };
        loadData();
    }, [user]);

    const handleFavoriteClick = async (e, productId) => {
        e.stopPropagation();
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            console.log('Текущее состояние избранного:', favorites);
            const favoriteItem = favorites.find(fav => fav.product.id === productId);
            console.log('Найденный элемент избранного:', favoriteItem);
            if (favoriteItem) {
                console.log('Отправка запроса на удаление с ID:', favoriteItem.id);
                await removeFromFavorites(favoriteItem.id);
                setFavorites(favorites.filter(fav => fav.id !== favoriteItem.id));
            } else {
                const newFavorite = await addToFavorites(productId);
                setFavorites([...favorites, newFavorite]);
            }
        } catch (e) {
            console.error('Ошибка при работе с избранным:', e);
        }
    };

    const isFavorite = (productId) => {
        return favorites.some(fav => fav.product.id === productId);
    };

    if (loading) {
        return (
            <Container className="mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Загрузка...</span>
                    </div>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <div className="alert alert-danger" role="alert">
                    Ошибка при загрузке товаров: {error}
                </div>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Row className="d-flex">
                <Col md={3}>
                    <SideBar />
                </Col>
                <Col md={9}>
                    <Row className="d-flex">
                        {products.map(product => (
                            <Col md={4} className="mt-3" key={product.id}>
                                <Card 
                                    style={{
                                        width: 300, 
                                        cursor: 'pointer',
                                        borderRadius: '15px',
                                        border: 'none',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                        transition: 'transform 0.2s ease-in-out'
                                    }} 
                                    className="hover-card"
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    onClick={() => navigate(DEVICE_ROUTE + '/' + product.id)}
                                >
                                    <Box sx={{ position: 'relative' }}>
                                        <div className="d-flex justify-content-center align-items-center p-4" style={{height: 200, backgroundColor: '#f8f9fa'}}>
                                            <img 
                                                width={150} 
                                                height={150} 
                                                src={product.image || "https://via.placeholder.com/150"} 
                                                style={{objectFit: 'contain'}}
                                                alt={product.name}
                                            />
                                        </div>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                                backdropFilter: 'blur(2px)',
                                                color: 'white',
                                                padding: '4px 8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 1,
                                                transition: 'background-color 0.2s ease-in-out'
                                            }}
                                        >
                                            <Rating
                                                value={product.average_rating || 0}
                                                readOnly
                                                precision={0.5}
                                                size="small"
                                                sx={{
                                                    '& .MuiRating-iconFilled': {
                                                        color: '#ffd700',
                                                        filter: 'drop-shadow(0 0 2px rgba(255, 215, 0, 0.3))'
                                                    }
                                                }}
                                            />
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    color: 'white',
                                                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                                                }}
                                            >
                                                {product.comments?.length || 0} отзывов
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div style={{fontSize: '18px', fontWeight: '500', color: '#2c3e50'}}>
                                                {product.name}
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div style={{fontSize: '20px', fontWeight: '600', color: '#2c3e50'}}>
                                                    {product.price}
                                                </div>
                                                <div className="ms-1" style={{color: '#7f8c8d'}}>₽</div>
                                            </div>
                                        </div>
                                        <Button 
                                            variant={isFavorite(product.id) ? "dark" : "outline-dark"}
                                            className="mt-3 w-100"
                                            style={{
                                                borderRadius: '8px',
                                                borderWidth: '2px',
                                                fontWeight: '500',
                                                transition: 'all 0.2s ease-in-out'
                                            }}
                                            onClick={(e) => handleFavoriteClick(e, product.id)}
                                            onMouseOver={(e) => {
                                                if (!isFavorite(product.id)) {
                                                    e.target.style.backgroundColor = '#2c3e50';
                                                    e.target.style.color = 'white';
                                                }
                                            }}
                                            onMouseOut={(e) => {
                                                if (!isFavorite(product.id)) {
                                                    e.target.style.backgroundColor = 'transparent';
                                                    e.target.style.color = '#2c3e50';
                                                }
                                            }}>
                                            {isFavorite(product.id) ? 'В избранном' : 'Добавить в избранное'}
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
});

export default Shop;