import React, { useContext } from 'react';
import { Navbar, Nav, Container, Dropdown, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MyUserContext } from '../../configs/MyContexts';

const Header = () => {
  const [user, dispatch] = useContext(MyUserContext);
  const isAuthenticated = user !== null;

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
            <Nav.Link href="#about">Giới thiệu</Nav.Link>
            <Nav.Link href="#contact">Liên hệ</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <Dropdown>
                <Dropdown.Toggle
                  variant="outline-light"
                  id="dropdown-basic"
                  style={{
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontWeight: '500',
                    borderWidth: '2px',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="rounded-circle"
                      style={{
                        width: '24px',
                        height: '24px',
                        objectFit: 'cover',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                      }}
                    />
                  ) : (
                    <i className="fas fa-user-circle" style={{ fontSize: '20px' }}></i>
                  )}
                  <span>{user?.fullname || user?.username}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="shadow-lg" style={{ borderRadius: '10px', border: 'none' }}>
                  <Dropdown.Header className="text-center py-2">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt="Avatar"
                          className="rounded-circle"
                          style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'cover',
                            border: '2px solid #007bff'
                          }}
                        />
                      ) : (
                        <i className="fas fa-user-circle text-primary" style={{ fontSize: '40px' }}></i>
                      )}
                    </div>
                    <div className="fw-bold text-dark">{user?.fullname || user?.username}</div>
                    <small className="text-muted">{user?.email}</small>
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  {user?.role === 'ORGANIZER' && (
                    <>
                      <Dropdown.Item as={Link} to="/secure/events" className="py-2">
                        <i className="fas fa-user-circle me-2 text-primary"></i>
                        Quản lý sự kiện
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/secure/revenue" className="py-2">
                        <i className="fas fa-chart-line me-2 text-success"></i>
                        Thống kê doanh thu
                      </Dropdown.Item>
                    </>
                  )}

                  <Dropdown.Item as={Link} to="/secure/profile" className="py-2">
                    <i className="fas fa-user-circle me-2 text-primary"></i>
                    Thông tin cá nhân
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/secure/payments" className="py-2">
                    <i className="fas fa-ticket-alt me-2 text-success"></i>
                    Đơn thanh toán
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/secure/tickets" className="py-2">
                    <i className="fas fa-list me-2 text-warning"></i>
                    Vé của tôi
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={() => dispatch({ type: "logout" })}
                    className="py-2 text-danger"
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Đăng xuất
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-light"
                  className="me-2"
                  style={{
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontWeight: '500',
                    borderWidth: '2px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <i className="fas fa-sign-in-alt me-1"></i>
                  Đăng nhập
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="warning"
                  className="fw-semibold"
                  style={{
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    background: 'linear-gradient(45deg, #ffc107, #ff8c00)',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(255, 193, 7, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(45deg, #ff8c00, #ff6b00)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(255, 193, 7, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(45deg, #ffc107, #ff8c00)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(255, 193, 7, 0.3)';
                  }}
                >
                  <i className="fas fa-user-plus me-1"></i>
                  Đăng ký
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
