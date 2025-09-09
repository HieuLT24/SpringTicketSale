import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-5">
      <Container>
        <Row>
          <Col md={4}>
            <h5 className="fw-bold mb-3">🎫 TicketHub</h5>
            <p className="text-white">
              Nền tảng bán vé sự kiện trực tuyến hàng đầu Việt Nam. 
              Đặt vé nhanh chóng, an toàn và tiện lợi.
            </p>
          </Col>
          <Col md={2}>
            <h6 className="fw-bold mb-3">Liên kết</h6>
            <ul className="list-unstyled">
              <li><a href="#home" className="text-white text-decoration-none">Trang chủ</a></li>
              <li><a href="#events" className="text-white text-decoration-none">Sự kiện</a></li>
              <li><a href="#about" className="text-white text-decoration-none">Giới thiệu</a></li>
              <li><a href="#contact" className="text-white text-decoration-none">Liên hệ</a></li>
            </ul>
          </Col>
          <Col md={2}>
            <h6 className="fw-bold mb-3">Hỗ trợ</h6>
            <ul className="list-unstyled">
              <li><a href="#help" className="text-white text-decoration-none">Trợ giúp</a></li>
              <li><a href="#policy" className="text-white text-decoration-none">Chính sách</a></li>
              <li><a href="#terms" className="text-white text-decoration-none">Điều khoản</a></li>
              <li><a href="#privacy" className="text-white text-decoration-none">Bảo mật</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h6 className="fw-bold mb-3">Liên hệ</h6>
            <p className="text-white mb-1">📧 support@tickethub.vn</p>
            <p className="text-white mb-1">📞 1900 1234</p>
            <p className="text-white mb-1">📍 123 Nguyễn Huệ, Q.1, TP.HCM</p>
            <div className="mt-3">
              <span className="text-white me-3">🌐 Facebook</span>
              <span className="text-white me-3">📷 Instagram</span>
              <span className="text-white">🐦 Twitter</span>
            </div>
          </Col>
        </Row>
        <hr className="my-4" />
        <Row>
          <Col className="text-center">
            <p className="text-white mb-0">
              © 2024 TicketHub. Tất cả quyền được bảo lưu.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
