import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { SHOP_ROUTE, LOGIN_ROUTE, BASKET_ROUTE, ADMIN_ROUTE } from "../utils/consts";
import { useAuth } from "../contexts/AuthContext";

const NavBar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate(SHOP_ROUTE);
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    }

    return (
        <Navbar bg="dark" data-bs-theme="dark" className="mb-4">
            <Container>
                <NavLink 
                    to={SHOP_ROUTE} 
                    className="text-decoration-none"
                    style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        marginRight: '20px'
                    }}
                >
                    СлышьКупи
                </NavLink>
                <Nav className="me-auto">
                    {user && user.role === 'ADMIN' && (
                        <NavLink 
                            to={ADMIN_ROUTE}
                            className={({isActive}) => 
                                `text-decoration-none me-3 ${isActive ? 'text-white' : 'text-secondary'}`
                            }
                        >
                            Админ панель
                        </NavLink>
                    )}
                </Nav>
                {user ? (
                    <Nav>
                        <Button 
                            variant="outline-light" 
                            onClick={() => navigate('/favorites')}
                            style={{
                                borderRadius: '8px',
                                borderWidth: '2px',
                                fontWeight: '500',
                                marginRight: '10px'
                            }}
                        >
                            Избранное
                        </Button>
                        <Button 
                            variant="outline-light" 
                            onClick={handleLogout}
                            style={{
                                borderRadius: '8px',
                                borderWidth: '2px',
                                fontWeight: '500'
                            }}
                        >
                            Выйти
                        </Button>
                    </Nav>
                ) : (
                    <Nav>
                        <Button 
                            variant="outline-light" 
                            onClick={() => navigate(LOGIN_ROUTE)}
                            style={{
                                borderRadius: '8px',
                                borderWidth: '2px',
                                fontWeight: '500'
                            }}
                        >
                            Авторизация
                        </Button>
                    </Nav>
                )}
            </Container>
        </Navbar>
    );
};

export default NavBar;
 