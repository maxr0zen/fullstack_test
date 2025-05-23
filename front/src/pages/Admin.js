import React, { useContext, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Context } from '../index';
import { useNavigate } from 'react-router-dom';
import { SHOP_ROUTE } from '../utils/consts';

const Admin = () => {
    const { user } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.isAuth || user.user.role !== 'ADMIN') {
            navigate(SHOP_ROUTE);
        }
    }, [user.isAuth, user.user.role, navigate]);

    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <h2>Панель администратора</h2>
                    <div className="mt-4">
                        {/* Здесь будет контент админ-панели */}
                        <p>Добро пожаловать в панель администратора!</p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Admin; 