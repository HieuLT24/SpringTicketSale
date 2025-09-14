import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import  Apis, { endpoints, authApis } from '../configs/Apis';

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(null);

    const loadEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await authApis().get(endpoints.myEvents);
            setEvents(response.data || []);
        } catch (error) {
            setError('Không thể tải danh sách sự kiện. Vui lòng thử lại sau.');
            setEvents([]);
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


    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            image: '',
            time: '',
            address: '',
            capacity: '',
            ticketPrice: '',
            categoryId: ''
        });
    };

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      };

    useEffect(() => {
        loadEvents();
        loadCategories();
    }, []);

    const handleCreateEvent = async () => {
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
          
          await authApis().post(endpoints.createEvent, formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          setShowCreateModal(false);
          alert('Tạo sự kiện thành công!');
          navigate('/secure/events');
          resetForm();
          setImage(null);
        } catch (error) {
          alert('Có lỗi xảy ra khi tạo sự kiện. Vui lòng thử lại.');
        } finally {
          setLoading(false);
        }
      };

    return (
        <main>

            <section className="py-5">
                <Container>
                    <Row className="mb-4">
                        <Col>
                            <Form className="bg-light p-3 rounded shadow-sm">
                            </Form>
                        </Col>
                    </Row>
                    <Row className="mb-5">
                        <Col>
                            <p className="text-center text-muted">
                                Danh sách sự kiện đã tổ chức
                            </p>
                        </Col>
                        <Button variant="success" onClick={() => {
                            resetForm();
                            setShowCreateModal(true);
                        }}>
                            + Tạo sự kiện mới
                        </Button>
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
                                                        onClick={() => navigate(`/secure/events/${event.id}`)}
                                                    >
                                                        Quản lý sự kiện
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
                    {!loading && !error && (
                        <Row className="mt-4">
                            <Col className="d-flex justify-content-center align-items-center gap-2">
                                <Button
                                    variant="outline-primary"
                                    disabled={page <= 1}
                                    onClick={() => navigate(`/secure/events?page=${page - 1}`)}
                                >
                                    ← Trang trước
                                </Button>
                                <span>Trang {page}</span>
                                <Button
                                    variant="primary"
                                    disabled={events.length < 9}
                                    onClick={() => navigate(`/secure/events?page=${page + 1}`)}
                                >
                                    Trang sau →
                                </Button>
                            </Col>
                        </Row>
                    )}
                    <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>Tạo sự kiện mới</Modal.Title>
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
                                    <Form.Control type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} />
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
                            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                                Hủy
                            </Button>
                            <Button variant="success" onClick={handleCreateEvent} disabled={loading}>
                                {loading ? 'Đang tạo...' : 'Tạo sự kiện'}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Container>
            </section>

        </main>
    );
};

export default MyEvents;
