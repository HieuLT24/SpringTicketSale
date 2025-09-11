import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Apis, { endpoints, authApis } from '../../configs/Apis';
import { MyUserContext } from '../../configs/MyContexts';
import cookie from 'react-cookies';

const Login = () => {
  const info = [{
    title: "Tên đăng nhập",
    field: "username",
    type: "text"
  }, {
    title: "Mật khẩu",
    field: "password",
    type: "password"
  }];

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const nav  = useNavigate();
  const [, dispatch] = useContext(MyUserContext);
  const [q] = useSearchParams();


  const validate = () => {
    if (user.username === '' || user.password === '') {
        setErr("Vui lòng nhập username và password!");
        return false;
    }

    return true;
}


const login = async (e) => {
  e.preventDefault();
  if (validate()) {
      let res = await Apis.post(endpoints['login'], {
          ...user
      });
      console.info(res.data)
      const token = res.data.token;
      cookie.save('token', token, {
        path: '/',
        maxAge: 86400,
        sameSite: 'lax',
        secure: false
      });

      const u = await authApis(token).get(endpoints['profile']);
      console.info(u.data);

      dispatch({
          "type": "login",
          "payload": u.data
      });

      let next = q.get('next')
      nav(next === null?"/":next);
  }
}


  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5} xl={4}>
            <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <span className="display-4">🎫</span>
                  </div>
                  <h2 className="fw-bold text-primary mb-2">Đăng nhập</h2>
                  <p className="text-muted">Chào mừng bạn quay trở lại!</p>
                </div>

                {err && (
                  <Alert variant="danger" className="text-center">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {err}
                  </Alert>
                )}

                <Form onSubmit={login}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      <i className="fas fa-user me-2 text-primary"></i>
                      Tên đăng nhập
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={user.username}
                      onChange={e => setUser({ ...user, username: e.target.value })}
                      placeholder="Nhập tên đăng nhập"
                      required
                      className={`border-0 ${err.username ? 'is-invalid' : ''}`}
                      style={{
                        backgroundColor: '#f8f9fa',
                        borderRadius: '10px',
                        padding: '12px 16px'
                      }}
                    />
                    {err.username && (
                      <div className="text-danger small mt-1">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {err.username}
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">
                      <i className="fas fa-lock me-2 text-primary"></i>
                      Mật khẩu
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={user.password}
                      onChange={e => setUser({ ...user, password: e.target.value })}
                      placeholder="Nhập mật khẩu"
                      required
                      className={`border-0 ${err.password ? 'is-invalid' : ''}`}
                      style={{
                        backgroundColor: '#f8f9fa',
                        borderRadius: '10px',
                        padding: '12px 16px'
                      }}
                    />
                    {err.password && (
                      <div className="text-danger small mt-1">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {err.password}
                      </div>
                    )}
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
                      background: 'linear-gradient(45deg, #007bff, #0056b3)',
                      border: 'none'
                    }}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Đang đăng nhập...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Đăng nhập
                      </>
                    )}
                  </Button>
                </Form>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Chưa có tài khoản?{' '}
                    <Link
                      to="/register"
                      className="text-primary fw-semibold text-decoration-none"
                    >
                      Đăng ký ngay
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

export default Login;
