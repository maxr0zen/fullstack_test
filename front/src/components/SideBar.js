import React from 'react';
import { Card, Nav } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { SHOP_ROUTE } from '../utils/consts';

const SideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    console.log('Текущий путь:', location.pathname);

    // Определяем текущую страницу
    const isFavoritesPage = location.pathname === '/favorites';
    const isShopPage = location.pathname === SHOP_ROUTE || location.pathname === '/';

    const renderNavigationLinks = () => {
        if (isShopPage) {
            return (
                <Nav.Link 
                    onClick={() => navigate('/favorites')}
                    className="d-flex align-items-center p-2"
                    style={{
                        color: '#34495e',
                        fontSize: '16px',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease-in-out',
                        backgroundColor: '#f8f9fa'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#e9ecef'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                >
                    <i className="bi bi-heart me-2"></i>
                    Перейти в избранное
                </Nav.Link>
            );
        } else if (isFavoritesPage) {
            return (
                <Nav.Link 
                    onClick={() => navigate(SHOP_ROUTE)}
                    className="d-flex align-items-center p-2"
                    style={{
                        color: '#34495e',
                        fontSize: '16px',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease-in-out',
                        backgroundColor: '#f8f9fa'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#e9ecef'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                >
                    <i className="bi bi-shop me-2"></i>
                    Перейти к товарам
                </Nav.Link>
            );
        }
    };

    return (
        <Card className="p-4 shadow-sm" style={{borderRadius: '15px', border: 'none'}}>
            <h3 className="mb-4" style={{color: '#2c3e50', fontWeight: '600'}}>Навигация</h3>
            <Nav className="d-flex flex-column gap-3">
                {renderNavigationLinks()}
            </Nav>
        </Card>
    );
};

export default SideBar; 