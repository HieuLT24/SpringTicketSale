import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authApis, endpoints } from '../../configs/Apis';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Email không hợp lệ');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('username', formData.username);
      formDataToSend.append('password', formData.password);
      
      if (avatar) {
        formDataToSend.append('avatar', avatar);
      }

      const response = await authApis().post(endpoints.register, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        setSuccess('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setError('Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại.');
      } else if (error.response?.data?.message?.includes('username')) {
        setError('Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.');
      } else if (error.response?.data?.message?.includes('email')) {
        setError('Email đã được sử dụng. Vui lòng chọn email khác.');
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <span className="display-4">🎫</span>
                  </div>
                  <h2 className="fw-bold text-primary mb-2">Đăng ký</h2>
                  <p className="text-muted">Tạo tài khoản mới để trải nghiệm dịch vụ</p>
                </div>

                {error && (
                  <Alert variant="danger" className="text-center">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert variant="success" className="text-center">
                    <i className="fas fa-check-circle me-2"></i>
                    {success}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <i className="fas fa-user me-2 text-primary"></i>
                          Họ và tên
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Nhập họ và tên"
                          required
                          className="border-0"
                          style={{ 
                            backgroundColor: '#f8f9fa',
                            borderRadius: '10px',
                            padding: '12px 16px'
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <i className="fas fa-envelope me-2 text-primary"></i>
                          Email
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Nhập email"
                          required
                          className="border-0"
                          style={{ 
                            backgroundColor: '#f8f9fa',
                            borderRadius: '10px',
                            padding: '12px 16px'
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      <i className="fas fa-at me-2 text-primary"></i>
                      Tên đăng nhập
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Nhập tên đăng nhập"
                      required
                      className="border-0"
                      style={{ 
                        backgroundColor: '#f8f9fa',
                        borderRadius: '10px',
                        padding: '12px 16px'
                      }}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <i className="fas fa-lock me-2 text-primary"></i>
                          Mật khẩu
                        </Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Nhập mật khẩu"
                          required
                          className="border-0"
                          style={{ 
                            backgroundColor: '#f8f9fa',
                            borderRadius: '10px',
                            padding: '12px 16px'
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <i className="fas fa-lock me-2 text-primary"></i>
                          Xác nhận mật khẩu
                        </Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Nhập lại mật khẩu"
                          required
                          className="border-0"
                          style={{ 
                            backgroundColor: '#f8f9fa',
                            borderRadius: '10px',
                            padding: '12px 16px'
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">
                      <i className="fas fa-image me-2 text-primary"></i>
                      Ảnh đại diện (tùy chọn)
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="border-0"
                      style={{ 
                        backgroundColor: '#f8f9fa',
                        borderRadius: '10px',
                        padding: '12px 16px'
                      }}
                    />
                    <Form.Text className="text-muted">
                      Chọn ảnh đại diện cho tài khoản của bạn
                    </Form.Text>
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-100 mb-3 fw-semibold"
                    disabled={loading}
                    style={{ 
                      borderRadius: '10px',
                      padding: '12px',
                      background: 'linear-gradient(45deg, #28a745, #20c997)',
                      border: 'none'
                    }}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Đang đăng ký...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus me-2"></i>
                        Đăng ký
                      </>
                    )}
                  </Button>
                </Form>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Đã có tài khoản?{' '}
                    <Link 
                      to="/login" 
                      className="text-primary fw-semibold text-decoration-none"
                    >
                      Đăng nhập ngay
                    </Link>
                  </p>
                </div>

                <div className="text-center mt-4">
                  <Link 
                    to="/" 
                    className="text-muted text-decoration-none"
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Quay về trang chủ
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
