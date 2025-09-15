import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Apis, { authApis, endpoints}   from '../configs/Apis';
import { MyUserContext } from '../configs/MyContexts';
import { ensureChatDocument, getChatIdForUsers } from '../services/chatService';

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [paying, setPaying] = useState(false);
  const [availableTickets, setAvailableTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('MOMO');
  const [user] = useContext(MyUserContext);

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

  const loadAvailableTickets = async () => {
    try {
      setLoadingTickets(true);
      const response = await Apis.get(endpoints.availableTickets(eventId));
      setAvailableTickets(response.data || []);
    } catch (error) {
      console.error('Error loading available tickets:', error);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleBookTicket = () => {
    loadAvailableTickets();
    setShowBookingModal(true);
  };

  const handleTicketSelect = (ticketId) => {
    setSelectedTickets(prev => {
      if (prev.includes(ticketId)) {
        return prev.filter(id => id !== ticketId);
      } else {
        return [...prev, ticketId];
      }
    });
  };

  const handleConfirmBooking = async () => {
    if (selectedTickets.length === 0) {
      alert('Vui lòng chọn ít nhất một vé');
      return;
    }
    
    try {
      setPaying(true);
      const totalAmount = (event?.ticketPrice || 0) * selectedTickets.length;
      const res = await authApis().post(endpoints.paymentProcess, {
        eventId: event?.id,
        ticketIds: selectedTickets,
        paymentMethod,
        totalAmount
      });
      const { paymentUrl } = res.data || {};
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        alert('Không tạo được liên kết thanh toán');
      }
    } catch (e) {
      console.error(e);
      alert('Có lỗi khi tạo thanh toán');
    } finally {
      setPaying(false);
    }
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
              <Card className="sticky-top shadow-lg" style={{ top: '80px', zIndex: 1000 }}>
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
                  {event?.organizerId && (
                    <Button 
                      variant="outline-secondary" 
                      size="md" 
                      className="w-100 mt-3"
                      onClick={async () => {
                        if (!user) {
                          navigate('/login');
                          return;
                        }
                        const meId = String(user.id);
                        const otherId = String(event.organizerId);
                        await ensureChatDocument(
                          meId,
                          otherId,
                          user.fullname || user.username || meId,
                          event.organizerName || otherId
                        );
                        navigate(`/secure/messages/${getChatIdForUsers(meId, otherId)}`);
                      }}
                    >
                      Nhắn tin với nhà tổ chức
                    </Button>
                  )}
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
              <h5 className="mb-3">Chọn ghế</h5>
              
              {loadingTickets ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Đang tải danh sách ghế...</p>
                </div>
              ) : availableTickets.length === 0 ? (
                <Alert variant="warning">
                  Không có ghế trống nào cho sự kiện này
                </Alert>
              ) : (
                <>
                  <div className="mb-3">
                    <p className="text-muted mb-2">
                      Có {availableTickets.length} ghế trống. Chọn ghế bạn muốn:
                    </p>
                    <div className="row g-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {availableTickets.map((ticket) => (
                        <div key={ticket.id} className="col-3">
                          <Button
                            variant={selectedTickets.includes(ticket.id) ? "primary" : "outline-primary"}
                            size="sm"
                            className="w-100"
                            onClick={() => handleTicketSelect(ticket.id)}
                          >
                            {ticket.seatNumber || `Ghế ${ticket.id}`}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Ghế đã chọn: {selectedTickets.length}</label>
                    <p className="text-muted small">
                      {selectedTickets.length > 0 
                        ? `Đã chọn ${selectedTickets.length} ghế` 
                        : 'Chưa chọn ghế nào'}
                    </p>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Giá mỗi vé</label>
                    <p className="fw-bold text-primary fs-5">{formatPrice(event.ticketPrice)}</p>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Phương thức thanh toán</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="paymentMethod" id="pmMomo" value="MOMO"
                          checked={paymentMethod === 'MOMO'} onChange={(e) => setPaymentMethod(e.target.value)} />
                        <label className="form-check-label" htmlFor="pmMomo">
                          MoMo
                        </label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="paymentMethod" id="pmVnpay" value="VNPAY"
                          checked={paymentMethod === 'VNPAY'} onChange={(e) => setPaymentMethod(e.target.value)} />
                        <label className="form-check-label" htmlFor="pmVnpay">
                          VNPay
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <hr />
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold">Tổng cộng:</span>
                    <span className="fw-bold text-success fs-5">
                      {formatPrice(event.ticketPrice * selectedTickets.length)}
                    </span>
                  </div>
                </>
              )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
            Hủy
          </Button>
          <Button 
            variant="primary" 
            onClick={handleConfirmBooking} 
            disabled={paying || selectedTickets.length === 0}
          >
            {paying ? `Đang chuyển đến ${paymentMethod}...` : `Thanh toán ${paymentMethod} (${selectedTickets.length} vé)`}
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
};

export default EventDetail;
