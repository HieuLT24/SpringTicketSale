import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Apis, { endpoints } from '../configs/Apis';

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
  
  const pageParam = parseInt(urlParams.get('page') || '1');
  const kwParam = urlParams.get('kw') || '';
  const fromPriceParam = urlParams.get('fromPrice') || '';
  const toPriceParam = urlParams.get('toPrice') || '';
  
  const [page, setPage] = useState(pageParam);
  const [kw, setKw] = useState(kwParam);
  const [fromPrice, setFromPrice] = useState(fromPriceParam);
  const [toPrice, setToPrice] = useState(toPriceParam);




  const loadEvents = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = { page: pageNumber };
      if (categoryParam) params.cateId = categoryParam;
      if (kwParam) params.kw = kwParam;
      if (fromPriceParam) params.fromPrice = fromPriceParam;
      if (toPriceParam) params.toPrice = toPriceParam;
      const response = await Apis.get(endpoints.events, { params });
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
    setKw(kwParam);
    setFromPrice(fromPriceParam);
    setToPrice(toPriceParam);
    if (categoryParam) {
      const categoryId = parseInt(categoryParam);
      setSelectedCategory(categoryId);
      setPage(1);
      loadEvents(1);
    } else {
      setSelectedCategory(null);
      setPage(pageParam);
      loadEvents(pageParam);
    }
  }, [categoryParam, pageParam, kwParam, fromPriceParam, toPriceParam]);

  const loadCategories = async() => {
    try {
      const response = await Apis.get(endpoints.categories);
      setCategories(response.data || []);
    } catch (error) {
      setCategories([]);
    }
  }


  const handleCategoryClick = (categoryId) => {
    const qs = new URLSearchParams();
    if (categoryId) qs.set('category', categoryId);
    if (kw) qs.set('kw', kw);
    if (fromPrice) qs.set('fromPrice', fromPrice);
    if (toPrice) qs.set('toPrice', toPrice);
    qs.set('page', '1');
    navigate(`/?${qs.toString()}`);
  };

  const handleShowAllEvents = () => {
    const qs = new URLSearchParams();
    if (kw) qs.set('kw', kw);
    if (fromPrice) qs.set('fromPrice', fromPrice);
    if (toPrice) qs.set('toPrice', toPrice);
    qs.set('page', '1');
    navigate(qs.toString() ? `/?${qs.toString()}` : '/');
  }

  const applyFilters = (e) => {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (selectedCategory) qs.set('category', selectedCategory);
    if (kw) qs.set('kw', kw);
    if (fromPrice) qs.set('fromPrice', fromPrice);
    if (toPrice) qs.set('toPrice', toPrice);
    qs.set('page', '1');
    navigate(`/?${qs.toString()}`);
  }

  const resetFilters = () => {
    setKw('');
    setFromPrice('');
    setToPrice('');
    setSelectedCategory(null);
    navigate('/');
  }

  const handlePageChange = (nextPage) => {
    if (nextPage < 1) return;
    const qs = new URLSearchParams();
    if (selectedCategory) qs.set('category', selectedCategory);
    if (kwParam) qs.set('kw', kwParam);
    if (fromPriceParam) qs.set('fromPrice', fromPriceParam);
    if (toPriceParam) qs.set('toPrice', toPriceParam);
    qs.set('page', String(nextPage));
    navigate(`/?${qs.toString()}`);
  };

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
            
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <Row className="mb-4">
            <Col>
              <Form onSubmit={applyFilters} className="bg-light p-3 rounded shadow-sm">
                <Row className="g-3 align-items-end">
                  <Col lg={4} md={6}>
                    <Form.Label>Tên sự kiện</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Nhập tên sự kiện..." 
                      value={kw}
                      onChange={(e) => setKw(e.target.value)}
                    />
                  </Col>
                  <Col lg={3} md={6}>
                    <Form.Label>Danh mục</Form.Label>
                    <Form.Select 
                      value={selectedCategory || ''}
                      onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
                    >
                      <option value="">Tất cả</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col lg={2} md={6}>
                    <Form.Label>Giá từ</Form.Label>
                    <Form.Control 
                      type="number" 
                      min="0"
                      value={fromPrice}
                      onChange={(e) => setFromPrice(e.target.value)}
                    />
                  </Col>
                  <Col lg={2} md={6}>
                    <Form.Label>đến</Form.Label>
                    <Form.Control 
                      type="number" 
                      min="0"
                      value={toPrice}
                      onChange={(e) => setToPrice(e.target.value)}
                    />
                  </Col>
                  <Col lg={1} className="d-flex gap-2">
                    <Button type="submit" variant="primary" className="flex-fill">Lọc</Button>
                    <Button type="button" variant="outline-secondary" onClick={resetFilters} className="flex-fill">Xóa</Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
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
                        style={{ height: '220px', objectFit: 'cover', width: '100%' }}
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
                          <Button 
                            variant="primary" 
                            className="w-100"
                            onClick={() => navigate(`/events/${event.id}`)}
                          >
                            Xem chi tiết
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
          {!loading && !error && !selectedCategory && (
            <Row className="mt-4">
              <Col className="d-flex justify-content-center align-items-center gap-2">
                <Button 
                  variant="outline-primary" 
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  ← Trang trước
                </Button>
                <span>Trang {page}</span>
                <Button 
                  variant="primary" 
                  disabled={events.length < 9}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Trang sau →
                </Button>
              </Col>
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
