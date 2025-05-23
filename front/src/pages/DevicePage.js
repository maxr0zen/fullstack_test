import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";

const DevicePage = () => {
    const {id} = useParams()
    console.log(id) // для проверки, что ID получается правильно

    return (
        <Container className="mt-4">
            <Row>
                <Col md={4}>
                    <Card 
                        style={{
                            border: 'none',
                            borderRadius: '15px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }}
                    >
                        <div 
                            className="d-flex justify-content-center align-items-center p-4" 
                            style={{
                                height: 400, 
                                backgroundColor: '#f8f9fa',
                                borderRadius: '15px 15px 0 0'
                            }}
                        >
                            <img 
                                width={300} 
                                height={300} 
                                src="https://via.placeholder.com/300" 
                                style={{objectFit: 'contain'}}
                            />
                        </div>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card 
                        style={{
                            border: 'none',
                            borderRadius: '15px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            padding: '20px'
                        }}
                    >
                        <h2 style={{color: '#2c3e50', fontWeight: '600'}}>Apple iPhone 12</h2>
                        <div 
                            className="d-flex align-items-center justify-content-center"
                            style={{
                                background: 'linear-gradient(to right, #f8f9fa, #e9ecef)',
                                borderRadius: '10px',
                                padding: '20px',
                                marginTop: '20px'
                            }}
                        >
                            <div style={{fontSize: '32px', fontWeight: '700', color: '#2c3e50'}}>1000</div>
                            <div style={{fontSize: '24px', color: '#7f8c8d', marginLeft: '5px'}}>₽</div>
                        </div>
                        <Button 
                            variant="outline-dark" 
                            className="mt-4 w-100"
                            style={{
                                borderRadius: '8px',
                                borderWidth: '2px',
                                fontWeight: '500',
                                transition: 'all 0.2s ease-in-out',
                                height: '50px'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#2c3e50';
                                e.target.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#2c3e50';
                            }}
                        >
                            Добавить в корзину
                        </Button>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card 
                        style={{
                            border: 'none',
                            borderRadius: '15px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            padding: '20px'
                        }}
                    >
                        <h3 style={{color: '#2c3e50', fontWeight: '600'}}>Характеристики</h3>
                        <div className="d-flex flex-column gap-3 mt-3">
                            <div className="d-flex justify-content-between">
                                <span style={{color: '#7f8c8d'}}>Процессор</span>
                                <span style={{color: '#2c3e50', fontWeight: '500'}}>Apple A14 Bionic</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span style={{color: '#7f8c8d'}}>Оперативная память</span>
                                <span style={{color: '#2c3e50', fontWeight: '500'}}>4 ГБ</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span style={{color: '#7f8c8d'}}>Встроенная память</span>
                                <span style={{color: '#2c3e50', fontWeight: '500'}}>128 ГБ</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span style={{color: '#7f8c8d'}}>Камера</span>
                                <span style={{color: '#2c3e50', fontWeight: '500'}}>12 Мп</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span style={{color: '#7f8c8d'}}>Аккумулятор</span>
                                <span style={{color: '#2c3e50', fontWeight: '500'}}>2815 мАч</span>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col md={12}>
                    <Card 
                        style={{
                            border: 'none',
                            borderRadius: '15px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            padding: '20px'
                        }}
                    >
                        <h3 style={{color: '#2c3e50', fontWeight: '600'}}>Описание</h3>
                        <p style={{color: '#34495e', lineHeight: '1.6'}}>
                            Apple iPhone 12 — это смартфон, который сочетает в себе мощь процессора A14 Bionic, 
                            потрясающую камеру и стильный дизайн. Устройство оснащено 6.1-дюймовым Super Retina XDR 
                            дисплеем с технологией OLED, который обеспечивает яркие цвета и глубокий черный цвет. 
                            Двойная камера с широкоугольным и сверхширокоугольным объективами позволяет делать 
                            потрясающие фотографии в любых условиях освещения.
                        </p>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DevicePage;