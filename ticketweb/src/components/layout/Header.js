import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          🎫 TicketHub
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>
            <Nav.Link href="#events">Sự kiện</Nav.Link>
            <Nav.Link as={Link} to="/categories">Danh mục</Nav.Link>
            <Nav.Link href="#about">Giới thiệu</Nav.Link>
            <Nav.Link href="#contact">Liên hệ</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <Button variant="outline-light" className="me-2">
              Đăng nhập
            </Button>
            <Button variant="warning">
              Đăng ký
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
