import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Apis, { endpoints } from '../../configs/Apis';

const ResetPassword = () => {
  const [q] = useSearchParams();
  const navigate = useNavigate();
  const token = q.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (password.length < 6) return setError('Mật khẩu tối thiểu 6 ký tự');
    if (password !== confirm) return setError('Mật khẩu nhập lại không khớp');
    try {
      setLoading(true);
      await Apis.post(endpoints.resetPassword, null, { params: { token, password, confirmPassword: confirm } });
      setMessage('Đặt lại mật khẩu thành công. Vui lòng đăng nhập.');
      setTimeout(() => navigate('/login'), 1500);
    } catch {
      setError('Token không hợp lệ hoặc đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5} xl={4}>
            <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary mb-2">Đặt lại mật khẩu</h2>
                </div>

                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu mới</Form.Label>
                    <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Nhập lại mật khẩu</Form.Label>
                    <Form.Control type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
                  </Form.Group>
                  <Button type="submit" className="w-100" disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : 'Cập nhật mật khẩu'}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <Link to="/login" className="text-muted text-decoration-none">← Quay về đăng nhập</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResetPassword;


