import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { authApis, endpoints } from './configs/Apis';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApis().get(endpoints.categories);
      setCategories(response.data);
    } catch (error) {
      setError('Không thể tải danh sách danh mục. Vui lòng thử lại sau.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);


  const getCategoryIcon = (categoryId, categoryName) => {
    const iconMap = {
      1: '🎵', 
      2: '📚', 
      3: '⚽', 
      4: '🎭', 
      5: '📖', 
    };
    return iconMap[categoryId] || '📋';
  };

  const getCategoryDescription = (categoryName) => {
    const descriptions = {
      'Âm nhạc': 'Concert, liveshow, festival âm nhạc và các sự kiện giải trí',
      'Hội thảo': 'Hội thảo, workshop, networking và sự kiện kinh doanh',
      'Thể thao': 'Bóng đá, tennis, marathon và các hoạt động thể thao',
      'Kịch & Nghệ thuật': 'Kịch, múa, triển lãm nghệ thuật và văn hóa',
      'Khóa học': 'Khóa học, đào tạo và sự kiện giáo dục'
    };
    return descriptions[categoryName] || 'Khám phá các sự kiện đa dạng và hấp dẫn';
  };

  return (
    <main className="py-5">
      <Container>
        <Row className="mb-5">
          <Col>
            <div className="text-center">
               <Button 
                 as={Link}
                 to="/"
                 variant="outline-primary" 
                 className="mb-3"
               >
                 ← Quay về trang chủ
               </Button>
              <h1 className="fw-bold mb-3">📂 Danh mục sự kiện</h1>
              <p className="lead text-muted">
                Khám phá các sự kiện theo từng danh mục yêu thích của bạn
              </p>
            </div>
          </Col>
        </Row>

        {loading && (
          <Row className="justify-content-center">
            <Col className="text-center">
              <Spinner animation="border" variant="primary" className="me-2" />
              <span>Đang tải danh mục...</span>
            </Col>
          </Row>
        )}

        {error && !loading && (
          <Row>
            <Col>
              <Alert variant="danger" className="text-center">
                <Alert.Heading>⚠️ Có lỗi xảy ra</Alert.Heading>
                <p>{error}</p>
                <Button variant="outline-danger" onClick={loadCategories}>
                  Thử lại
                </Button>
              </Alert>
            </Col>
          </Row>
        )}

        {!loading && !error && (
          <>
            <Row>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <Col lg={4} md={6} className="mb-4" key={category.id}>
                     <Card 
                       className="h-100 shadow-sm category-detail-card"
                       style={{ transition: 'all 0.3s ease' }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.transform = 'translateY(-8px)';
                         e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 123, 255, 0.15)';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.transform = 'translateY(0)';
                         e.currentTarget.style.boxShadow = '';
                       }}
                     >
                      <Card.Body className="text-center p-4">
                        <div className="mb-3">
                          <div className="display-3 mb-3">
                            {getCategoryIcon(category.id, category.name)}
                          </div>
                          <Badge bg="primary" className="mb-3">
                            ID: {category.id}
                          </Badge>
                        </div>
                        
                        <Card.Title className="h4 fw-bold mb-3">
                          {category.name}
                        </Card.Title>
                        
                        <Card.Text className="text-muted mb-4">
                          {getCategoryDescription(category.name)}
                        </Card.Text>
                        
                         <Button 
                           as={Link}
                           to={`/?category=${category.id}`}
                           variant="primary" 
                           className="w-100"
                         >
                           Xem sự kiện →
                         </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col className="text-center">
                  <Alert variant="info">
                    <Alert.Heading>📂 Chưa có danh mục nào</Alert.Heading>
                    <p>Hiện tại chưa có danh mục sự kiện nào. Vui lòng quay lại sau!</p>
                  </Alert>
                </Col>
              )}
            </Row>

            {categories.length > 0 && (
              <Row className="mt-5">
                <Col>
                  <div className="text-center p-4 bg-light rounded">
                    <h5 className="fw-bold mb-2">
                      📊 Tổng cộng: {categories.length} danh mục
                    </h5>
                    <p className="text-muted mb-3">
                      Khám phá đa dạng các loại sự kiện từ âm nhạc, thể thao đến giáo dục
                    </p>
                     <Button as={Link} to="/" variant="primary">
                       Khám phá tất cả sự kiện
                     </Button>
                  </div>
                </Col>
              </Row>
            )}
          </>
        )}
      </Container>
    </main>
  );
};

export default Categories;
