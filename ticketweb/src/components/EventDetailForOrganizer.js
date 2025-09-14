import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Modal, Form, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import  Apis, { endpoints, authApis} from '../configs/Apis';

const EventDetailForOrganizer = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [soldTickets, setSoldTickets] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    time: '',
    address: '',
    capacity: '',
    ticketPrice: '',
    categoryId: ''
  });

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApis().get(endpoints.eventDetail(eventId));
      setEvent(response.data);
    } catch (error) {
      setError('Không thể tải thông tin sự kiện. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await Apis.get(endpoints.categories);
      setCategories(response.data || []);
    } catch (error) {
      console.error('Không thể tải danh mục:', error);
    }
  };


  const loadSoldTickets = async () => {
    try {
      const response = await authApis().get(endpoints.eventSoldTickets(eventId));
      setSoldTickets(response.data.soldTickets || 0);
    } catch (error) {
      console.error('Không thể tải số vé đã bán:', error);
      setSoldTickets(0);
    }
  };

  const loadRevenue = async () => {
    try {
      const response = await authApis().get(endpoints.eventRevenue(eventId));
      setRevenue(response.data.revenue || 0);
    } catch (error) {
      console.error('Không thể tải doanh thu:', error);
      setRevenue(0);
    }
  };

  useEffect(() => {
    loadEvent();
    loadCategories();
    loadSoldTickets();
    loadRevenue();
  }, [eventId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    if (event) {
      setFormData({
        name: event.name || '',
        description: event.description || '',
        image: event.image || '',
        time: event.time ? new Date(event.time).toISOString().slice(0, 16) : '',
        address: event.address || '',
        capacity: event.capacity || '',
        ticketPrice: event.ticketPrice || '',
        categoryId: event.categoryId || ''
      });
      setShowEditModal(true);
    }
  };

  const handleUpdateEvent = async () => {
    try {
      setLoading(true);
        
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('time', formData.time);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('capacity', formData.capacity);
      formDataToSend.append('ticketPrice', formData.ticketPrice);
      formDataToSend.append('categoryId', formData.categoryId);
      
      if (image) {
        formDataToSend.append('image', image);
      }
      
      await authApis().put(endpoints.updateEvent(eventId), formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setShowEditModal(false);
      loadEvent();
      alert('Cập nhật sự kiện thành công!');
      setImage(null);
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật sự kiện. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      setLoading(true);
      await authApis().delete(endpoints.deleteEvent(eventId));
      setShowDeleteModal(false);
      alert('Xóa sự kiện thành công!');
      navigate('/secure/events');
    } catch (error) {
      alert('Có lỗi xảy ra khi xóa sự kiện. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };





  if (loading && !event) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col className="text-center">
            <Spinner animation="border" variant="primary" className="me-2" />
            <span>Đang tải thông tin sự kiện...</span>
          </Col>
        </Row>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Alert variant="danger">
              <Alert.Heading>Lỗi!</Alert.Heading>
              <p>{error}</p>
              <Button variant="outline-danger" onClick={() => navigate('/secure/events')}>
                Quay lại danh sách
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Button variant="outline-secondary" onClick={() => navigate('/secure/events')}>
                ← Quay lại
              </Button>
            </div>
            <div className="d-flex gap-2">
              
              <Button variant="primary" onClick={handleEdit}>
                ✏️ Chỉnh sửa
              </Button>
              <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                🗑️ Xóa sự kiện
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {event && (
        <Row>
          <Col lg={8}>
            <Card className="shadow-sm">
              <Card.Img 
                variant="top" 
                src={event.image} 
                alt={event.name}
                style={{ height: '400px', objectFit: 'cover' }}
              />
              <Card.Body>
                <div className="mb-3">
                  <Badge bg="primary" className="me-2">
                    {event.categoryName || 'Chưa phân loại'}
                  </Badge>
                  <Badge bg="info">
                    ID: {event.id}
                  </Badge>
                </div>
                <Card.Title className="h2 mb-3">{event.name}</Card.Title>
                <Card.Text className="mb-4">{event.description}</Card.Text>
                
                <Row className="mb-3">
                  <Col md={6}>
                    <h6>📅 Thời gian:</h6>
                    <p className="text-muted">
                      {event.time ? new Date(event.time).toLocaleString('vi-VN') : 'Chưa xác định'}
                    </p>
                  </Col>
                  <Col md={6}>
                    <h6>📍 Địa điểm:</h6>
                    <p className="text-muted">{event.address || 'Chưa xác định'}</p>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <h6>👥 Sức chứa:</h6>
                    <p className="text-muted">{event.capacity ? `${event.capacity} người` : 'Chưa xác định'}</p>
                  </Col>
                  <Col md={6}>
                    <h6>💰 Giá vé:</h6>
                    <p className="text-primary fw-bold">
                      {event.ticketPrice ? `${event.ticketPrice.toLocaleString('vi-VN')} VNĐ` : 'Liên hệ'}
                    </p>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <h6>👤 Người tổ chức:</h6>
                    <p className="text-muted">{event.organizerName || 'Chưa xác định'}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="shadow-sm">
              <Card.Header>
                <h5 className="mb-0">Thống kê sự kiện</h5>
              </Card.Header>
              <Card.Body>
                <div className="text-center">
                  <div className="mb-3">
                    <h3 className="text-primary">{soldTickets || 0}</h3>
                    <p className="text-muted mb-0">Vé đã bán</p>
                  </div>
                  <div className="mb-3">
                    <h3 className="text-success">{revenue ? revenue.toLocaleString('vi-VN') + ' VNĐ' : '0 VNĐ'}</h3>
                    <p className="text-muted mb-0">Doanh thu</p>
                  </div>
                  <div className="mb-3">
                    <h3 className="text-info">{event ? (event.capacity - soldTickets) : 0}</h3>
                    <p className="text-muted mb-0">Vé còn lại</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa sự kiện</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên sự kiện *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Danh mục</Form.Label>
                  <Form.Select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Hình ảnh (URL)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={e => setImage(e.target.files?.[0] || null)}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Thời gian</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Địa điểm</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sức chứa</Form.Label>
                  <Form.Control
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    min="1"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá vé (VNĐ)</Form.Label>
                  <Form.Control
                    type="number"
                    name="ticketPrice"
                    value={formData.ticketPrice}
                    onChange={handleInputChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleUpdateEvent} disabled={loading}>
            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        </Modal.Footer>
      </Modal>

      

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa sự kiện</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa sự kiện <strong>"{event?.name}"</strong>?</p>
          <p className="text-danger">Hành động này không thể hoàn tác!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteEvent} disabled={loading}>
            {loading ? 'Đang xóa...' : 'Xóa sự kiện'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EventDetailForOrganizer;
