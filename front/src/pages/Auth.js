import React, { useState } from "react";
import { Card, Container, Form, Button, Row } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "../utils/consts";
import { login, registration } from "../http/userAPI";
import { useAuth } from "../contexts/AuthContext";
import { tokenService } from "../utils/tokenService";

const Auth = () => {
    const { login: authLogin } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                console.log('Начало процесса авторизации');
                await authLogin(formData.username, formData.password);
                console.log('Авторизация успешна, переход на главную');
                navigate(SHOP_ROUTE);
            } else {
                console.log('Начало процесса регистрации');
                const regData = await registration(
                    formData.username,
                    formData.email,
                    formData.password,
                    formData.password2
                );
                console.log('Регистрация успешна:', regData);
                navigate(LOGIN_ROUTE);
            }
        } catch (e) {
            console.error('Ошибка авторизации:', e);
            setError(e.response?.data?.detail || e.message || 'Произошла ошибка');
        }
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{height: window.innerHeight - 54}}
        >
            <Card style={{width: 600}} className="p-5">
                <h2 className="m-auto">{isLogin ? 'Авторизация' : "Регистрация"}</h2>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
                <Form className="d-flex flex-column" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <Form.Control
                            className="mt-3"
                            placeholder="Введите email..."
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    )}
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите логин..."
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите пароль..."
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {!isLogin && (
                        <Form.Control
                            className="mt-3"
                            placeholder="Подтвердите пароль..."
                            name="password2"
                            type="password"
                            value={formData.password2}
                            onChange={handleChange}
                            required
                        />
                    )}
                    <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
                        {isLogin ?
                            <div>
                                Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйся!</NavLink>
                            </div>
                            :
                            <div>
                                Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
                            </div>
                        }
                        <Button
                            variant={"outline-success"}
                            type="submit"
                        >
                            {isLogin ? 'Войти' : 'Регистрация'}
                        </Button>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
};

export default Auth;