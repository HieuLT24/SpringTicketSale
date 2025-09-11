import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { authApis, endpoints } from '../configs/Apis';

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  useEffect(() => {
    loadEventDetail();
  }, [eventId]);

  const loadEventDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApis().get(endpoints.eventDetail(eventId));
      setEvent(response.data);
    } catch (error) {
      setError('Không thể tải thông tin sự kiện. Vui lòng thử lại sau.');
      console.error('Error loading event detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookTicket = () => {
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    alert(`Đã đặt ${ticketQuantity} vé cho sự kiện "${event?.name}"`);
    setShowBookingModal(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xác định';
    return new Date(dateString).toLocaleString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    if (!price) return 'Liên hệ';
    return `${price.toLocaleString('vi-VN')} VNĐ`;
  };

  if (loading) {
    return (
      <main className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col className="text-center">
              <Spinner animation="border" variant="primary" className="me-2" />
              <span>Đang tải thông tin sự kiện...</span>
            </Col>
          </Row>
        </Container>
      </main>
    );
  }

  if (error) {
    return (
      <main className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8}>
              <Alert variant="danger">
                <Alert.Heading>Lỗi tải dữ liệu</Alert.Heading>
                <p>{error}</p>
                <Button variant="outline-danger" onClick={() => navigate('/')}>
                  Quay về trang chủ
                </Button>
              </Alert>
            </Col>
          </Row>
        </Container>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col className="text-center">
              <Alert variant="info">
                <Alert.Heading>Sự kiện không tồn tại</Alert.Heading>
                <p>Sự kiện bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                <Button variant="outline-primary" onClick={() => navigate('/')}>
                  Quay về trang chủ
                </Button>
              </Alert>
            </Col>
          </Row>
        </Container>
      </main>
    );
  }

  return (
    <main>
      <section className="bg-gradient-primary text-white py-5" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <div className="mb-3">
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  onClick={() => navigate('/')}
                  className="mb-3"
                >
                  ← Quay lại
                </Button>
                <Badge bg="light" text="dark" className="fs-6 px-3 py-2">
                  {event.category?.name}
                </Badge>
              </div>
              <h1 className="display-4 fw-bold mb-4">{event.name}</h1>
              <div className="d-flex flex-wrap gap-4 mb-4">
                <div className="d-flex align-items-center">
                  <i className="bi bi-calendar-event me-2"></i>
                  <span>{formatDate(event.time)}</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="bi bi-geo-alt me-2"></i>
                  <span>{event.address}</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="bi bi-currency-dollar me-2"></i>
                  <span className="fw-bold">{formatPrice(event.ticketPrice)}</span>
                </div>
              </div>
            </Col>

          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <Row>
            <Col lg={8}>
              <Card className="mb-4 shadow-sm">
                <Card.Img 
                  variant="top" 
                  src={event.image} 
                  alt={event.name}
                  style={{ height: '400px', objectFit: 'cover' }}
                />
              </Card>

              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <h3 className="mb-3">Giới thiệu sự kiện</h3>
                  <p className="lead">
                    {event.description || 'Thông tin chi tiết về sự kiện sẽ được cập nhật sớm. Vui lòng liên hệ với ban tổ chức để biết thêm thông tin.'}
                  </p>
                </Card.Body>
              </Card>

              <Card className="shadow-sm">
                <Card.Body>
                  <h3 className="mb-4">Thông tin sự kiện</h3>
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <h5 className="text-primary mb-2">📅 Thời gian</h5>
                        <p className="mb-0">{formatDate(event.time)}</p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <h5 className="text-primary mb-2">📍 Địa điểm</h5>
                        <p className="mb-0">{event.address}</p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <h5 className="text-primary mb-2">🎫 Giá vé</h5>
                        <p className="mb-0 fw-bold text-success">{formatPrice(event.ticketPrice)}</p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <h5 className="text-primary mb-2">🏷️ Danh mục</h5>
                        <p className="mb-0">{event.category?.name}</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="sticky-top shadow-lg" style={{ top: '80px' }}>
                <Card.Body className="text-center">
                  <h4 className="mb-3">Đặt vé</h4>
                  <div className="mb-4">
                    <h2 className="text-primary fw-bold">{formatPrice(event.ticketPrice)}</h2>
                    <p className="text-muted mb-0">Mỗi vé</p>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-100 mb-3"
                    onClick={handleBookTicket}
                  >
                    Đặt vé ngay
                  </Button>
                  
                  <div className="text-muted small">
                    <p className="mb-2">✅ Đặt vé an toàn</p>
                    <p className="mb-2">⚡ Xác nhận ngay lập tức</p>
                    <p className="mb-0">📱 Nhận vé qua email</p>
                  </div>
                </Card.Body>
              </Card>

              
            </Col>
          </Row>
        </Container>
      </section>

      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Đặt vé - {event.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Card>
                <Card.Img 
                  variant="top" 
                  src={event.image} 
                  alt={event.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <h5>{event.name}</h5>
                  <p className="text-muted mb-2">{formatDate(event.time)}</p>
                  <p className="text-muted mb-0">{event.address}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <h5 className="mb-3">Thông tin đặt vé</h5>
              <div className="mb-3">
                <label className="form-label">Số lượng vé</label>
                <div className="input-group">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                  >
                    -
                  </Button>
                  <input 
                    type="number" 
                    className="form-control text-center" 
                    value={ticketQuantity}
                    onChange={(e) => setTicketQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                  />
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setTicketQuantity(ticketQuantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Giá mỗi vé</label>
                <p className="fw-bold text-primary fs-5">{formatPrice(event.ticketPrice)}</p>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <span className="fw-bold">Tổng cộng:</span>
                <span className="fw-bold text-success fs-5">
                  {formatPrice(event.ticketPrice * ticketQuantity)}
                </span>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleConfirmBooking}>
            Xác nhận đặt vé
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
};

export default EventDetail;
