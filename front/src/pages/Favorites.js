import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { getFavorites, removeFromFavorites } from "../http/deviceAPI";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { DEVICE_ROUTE } from "../utils/consts";
import { useAuth } from "../hooks/useAuth";
import SideBar from "../components/SideBar";

const Favorites = observer(() => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const loadFavorites = async () => {
            try {
                const data = await getFavorites();
                console.log('Полученные данные избранного с товарами:', data);
                setFavorites(data.results || []);
                setLoading(false);
            } catch (e) {
                console.error('Ошибка при загрузке избранного:', e);
                setError(e.message);
                setLoading(false);
            }
        };
        loadFavorites();
    }, [user, navigate]);

    const handleRemoveFromFavorites = async (e, favoriteId) => {
        e.stopPropagation();
        try {
            await removeFromFavorites(favoriteId);
            setFavorites(favorites.filter(fav => fav.id !== favoriteId));
        } catch (e) {
            console.error('Ошибка при удалении из избранного:', e);
        }
    };

    if (!user) {
        return null;
    }

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
                    Ошибка при загрузке избранного: {error}
                </div>
            </Container>
        );
    }

    // Удаляем дубликаты товаров (если один товар добавлен несколько раз)
    const uniqueFavorites = favorites.reduce((acc, current) => {
        const x = acc.find(item => item.product.id === current.product.id);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, []);

    return (
        <Container className="mt-4">
            <Row className="d-flex">
                <Col md={3}>
                    <SideBar />
                </Col>
                <Col md={9}>
                    <h2 className="mb-4" style={{ color: '#2c3e50', fontWeight: '600' }}>
                        Избранные товары
                    </h2>
                    {uniqueFavorites.length === 0 ? (
                        <div className="text-center py-5">
                            <h4 style={{ color: '#7f8c8d' }}>В избранном пока ничего нет</h4>
                            <Button 
                                variant="outline-dark" 
                                className="mt-3"
                                onClick={() => navigate('/shop')}
                                style={{
                                    borderRadius: '8px',
                                    borderWidth: '2px',
                                    fontWeight: '500',
                                    padding: '10px 20px'
                                }}>
                                Перейти в магазин
                            </Button>
                        </div>
                    ) : (
                        <Row className="d-flex">
                            {uniqueFavorites.map(favorite => (
                                <Col md={4} className="mt-3" key={favorite.id}>
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
                                        onClick={() => navigate(DEVICE_ROUTE + '/' + favorite.product.id)}
                                    >
                                        <div className="d-flex justify-content-center align-items-center p-4" 
                                             style={{height: 200, backgroundColor: '#f8f9fa'}}>
                                            <img 
                                                width={150}
                                                height={150}
                                                src={favorite.product.image || "/placeholder.png"}
                                                style={{objectFit: 'contain'}}
                                                alt={favorite.product.name}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/placeholder.png";
                                                }}
                                            />
                                        </div>
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div style={{fontSize: '18px', fontWeight: '500', color: '#2c3e50'}}>
                                                    {favorite.product.name}
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <div style={{fontSize: '20px', fontWeight: '600', color: '#2c3e50'}}>
                                                        {favorite.product.price}
                                                    </div>
                                                    <div className="ms-1" style={{color: '#7f8c8d'}}>₽</div>
                                                </div>
                                            </div>
                                            <Button 
                                                variant="outline-danger"
                                                className="mt-3 w-100"
                                                style={{
                                                    borderRadius: '8px',
                                                    borderWidth: '2px',
                                                    fontWeight: '500',
                                                    transition: 'all 0.2s ease-in-out'
                                                }}
                                                onClick={(e) => handleRemoveFromFavorites(e, favorite.id)}
                                                onMouseOver={(e) => {
                                                    e.target.style.backgroundColor = '#dc3545';
                                                    e.target.style.color = 'white';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.target.style.backgroundColor = 'transparent';
                                                    e.target.style.color = '#dc3545';
                                                }}>
                                                Удалить из избранного
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Col>
            </Row>
        </Container>
    );
});

export default Favorites; 