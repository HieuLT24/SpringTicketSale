import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApis, endpoints } from './configs/Apis';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const urlParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const categoryParam = urlParams.get('category');




  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApis().get(endpoints.events);
      setEvents(response.data || []);
    } catch (error) {
      setError('Không thể tải danh sách sự kiện. Vui lòng thử lại sau.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      const categoryId = parseInt(categoryParam);
      setSelectedCategory(categoryId);
      loadEventsByCategory(categoryId);
    } else {
      setSelectedCategory(null);
      loadEvents();
    }
  }, [categoryParam]);

  const loadCategories = async() => {
    try {
      const response = await authApis().get(endpoints.categories);
      setCategories(response.data || []);
    } catch (error) {
      setCategories([]);
    }
  }

  const loadEventsByCategory = async (categoryId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApis().get(endpoints.eventsByCateId(categoryId)); 
      setEvents(response.data);
    } catch (error) {
      setError('Không thể tải sự kiện theo danh mục. Vui lòng thử lại sau.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  const handleCategoryClick = (categoryId) => {
    navigate(`/?category=${categoryId}`);
  };

  const handleShowAllEvents = () => {
    navigate('/');
  }

  return (
    <main>
      <section className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">
                Khám phá những sự kiện tuyệt vời
              </h1>
              <p className="lead mb-4">
                Đặt vé cho hàng ngàn sự kiện hấp dẫn từ concert, hội thảo đến triển lãm. 
                Trải nghiệm đặt vé nhanh chóng và an toàn cùng TicketHub.
              </p>
              <Button variant="warning" size="lg" className="me-3">
                Khám phá ngay
              </Button>
              <Button variant="outline-light" size="lg">
                Tìm hiểu thêm
              </Button>
            </Col>
            <Col lg={6} className="text-center">
              <div className="bg-light rounded p-4" style={{minHeight: "300px"}}>
                <h3 className="text-dark">🎭 Sự kiện nổi bật</h3>
                <p className="text-muted">Hình ảnh banner sự kiện sẽ hiển thị ở đây</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <Row className="mb-5">
            <Col>
              <h2 className="text-center fw-bold mb-3">
                {selectedCategory ? 
                  `Sự kiện - ${categories.find(c => c.id === selectedCategory)?.name}` : 
                  'Sự kiện nổi bật'
                }
              </h2>
              <p className="text-center text-muted">
                {selectedCategory ? 
                  'Danh sách sự kiện theo danh mục đã chọn' :
                  'Những sự kiện được yêu thích nhất hiện tại'
                }
              </p>
              {selectedCategory && (
                <div className="text-center mb-3">
                  <Button variant="outline-primary" onClick={handleShowAllEvents}>
                    ← Xem tất cả sự kiện
                  </Button>
                </div>
              )}
            </Col>
          </Row>
          {loading && (
            <Row className="justify-content-center">
              <Col className="text-center">
                <Spinner animation="border" variant="primary" className="me-2" />
                <span>Đang tải sự kiện...</span>
              </Col>
            </Row>
          )}


          {!loading && !error && (
            <Row>
              {events.length > 0 ? (
                events.map(event => (
                  <Col lg={4} md={6} className="mb-4" key={event.id}>
                    <Card className="h-100 shadow-sm">
                      <Card.Img 
                        variant="top" 
                        src={event.image} 
                        alt={event.name} 
                      />
                      <Card.Body className="d-flex flex-column">
                        <div className="mb-2">
                          <Badge bg="secondary" className="mb-2">
                            {event.category?.name}
                          </Badge>
                        </div>
                        <Card.Title className="h5">{event.name}</Card.Title>
                        <div className="mb-3">
                          <p className="text-muted mb-1">
                            📅 {event.time ? new Date(event.time).toLocaleString('vi-VN') : 'TBA'}
                          </p>
                          <p className="text-muted mb-1">📍 {event.address}</p>
                          <p className="fw-bold text-primary mb-0">
                            💰 {event.ticketPrice ? `${event.ticketPrice.toLocaleString('vi-VN')} VNĐ` : "Liên hệ"}
                          </p>
                        </div>
                        <div className="mt-auto">
                          <Button variant="primary" className="w-100">
                            Đặt vé ngay
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col className="text-center">
                  <Alert variant="info">
                    <Alert.Heading>Chưa có sự kiện nào</Alert.Heading>
                    <p>Hiện tại chưa có sự kiện nào được tổ chức. Vui lòng quay lại sau!</p>
                  </Alert>
                </Col>
              )}
            </Row>
          )}
        </Container>
      </section>

      <section className="py-5 bg-light">
        <Container>
          <Row className="mb-5">
            <Col>
              <h2 className="text-center fw-bold mb-3">Danh mục sự kiện</h2>
              <p className="text-center text-muted">
                Tìm kiếm sự kiện theo sở thích của bạn
              </p>
            </Col>
          </Row>
          <Row>
            {categories.slice(0, 4).map((category, index) => {
              const icons = ['🎵', '📚', '⚽', '🎭'];
              const descriptions = [
                'Concert, liveshow, festival âm nhạc',
                'Hội thảo, workshop, networking', 
                'Bóng đá, tennis, marathon',
                'Kịch, múa, triển lãm nghệ thuật'
              ];
              
              return (
                <Col lg={3} md={6} className="mb-4 text-center" key={category.id}>
                  <div 
                    className={`bg-white rounded p-4 shadow-sm h-100 category-card ${
                      selectedCategory === category.id ? 'border-primary' : ''
                    }`}
                    style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                    onClick={() => handleCategoryClick(category.id)}
                    onMouseEnter={(e) => e.target.closest('.category-card').style.transform = 'translateY(-5px)'}
                    onMouseLeave={(e) => e.target.closest('.category-card').style.transform = 'translateY(0)'}
                  >
                    <div className="display-4 mb-3">{icons[index] || '📋'}</div>
                    <h5 className="fw-bold">{category.name}</h5>
                    <p className="text-muted">{descriptions[index]}</p>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default Home;
