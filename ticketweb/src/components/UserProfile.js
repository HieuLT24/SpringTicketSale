import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { MyUserContext } from '../configs/MyContexts';
import { authApis, endpoints } from '../configs/Apis';
import cookie from 'react-cookies';

const UserProfile = () => {
  const [user, dispatch] = useContext(MyUserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(null);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOrganizerForm, setShowOrganizerForm] = useState(false);
  const [hasOrganizerRequest, setHasOrganizerRequest] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await authApis().get(endpoints.profile);
        setFullname(res.data.fullname || '');
        setEmail(res.data.email || '');
        dispatch({ type: 'login', payload: res.data });
        
        if (res.data.role !== 'ORGANIZER') {
          try {
            const requestStatusRes = await authApis().get(endpoints.organizerRequestStatus);
            setHasOrganizerRequest(requestStatusRes.data.hasRequest);
          } catch (e) {
            console.log('Không thể kiểm tra trạng thái yêu cầu:', e);
          }
        }
      } catch (e) {
        setError('Không thể tải thông tin cá nhân');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [dispatch]);

  const onUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      const form = new FormData();
      form.append('fullname', fullname || '');
      form.append('email', email || '');
      if (avatar) form.append('avatar', avatar);

      const res = await authApis().post(endpoints.updateProfile, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Cập nhật thông tin thành công');
      dispatch({ type: 'login', payload: res.data });
    } catch (e) {
      setError('Cập nhật thất bại');
    }
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      setError('Vui lòng nhập đầy đủ mật khẩu');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    try {
      setError('');
      setSuccess('');
      await authApis().post(endpoints.changePassword, {
        oldPassword,
        newPassword
      });
      setSuccess('Đổi mật khẩu thành công');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      setError('Đổi mật khẩu thất bại');
    }
  };

  const onRequestOrganizer = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      await authApis().post(endpoints.organizerRequest, {});
      setSuccess('Yêu cầu đăng ký làm nhà tổ chức đã được gửi thành công');
      setHasOrganizerRequest(true);
      setShowOrganizerForm(false);
    } catch (e) {
      setError(e.response?.data || 'Gửi yêu cầu thất bại');
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <main className="py-4">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="shadow-sm">
              <Card.Body>
                <h3 className="mb-4">Thông tin cá nhân</h3>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={onUpdateProfile} className="mb-4">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Họ tên</Form.Label>
                        <Form.Control type="text" value={fullname} onChange={e => setFullname(e.target.value)} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Tên đăng nhập</Form.Label>
                        <Form.Control value={user?.username || ''} disabled />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Ảnh đại diện</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={e => setAvatar(e.target.files?.[0] || null)} />
                  </Form.Group>

                  <Button type="submit" variant="primary">Lưu thay đổi</Button>
                </Form>

                <hr />

                <h5 className="mb-3">Đổi mật khẩu</h5>
                <Form onSubmit={onChangePassword}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu hiện tại</Form.Label>
                    <Form.Control type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu mới</Form.Label>
                    <Form.Control type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                    <Form.Control type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  </Form.Group>
                  <Button type="submit" variant="warning">Đổi mật khẩu</Button>
                </Form>

                <hr />

                <h5 className="mb-3">Đăng ký làm Nhà tổ chức</h5>
                {user?.role !== 'ORGANIZER' && (
                  <>
                    {hasOrganizerRequest ? (
                      <Alert variant="warning">
                        Bạn đã gửi yêu cầu đăng ký làm nhà tổ chức. Vui lòng chờ phản hồi từ quản trị viên.
                      </Alert>
                    ) : (
                      <>
                        {!showOrganizerForm ? (
                          <Button 
                            variant="success" 
                            onClick={() => setShowOrganizerForm(true)}
                            className="mb-3"
                          >
                            Yêu cầu đăng ký làm Nhà tổ chức
                          </Button>
                        ) : (
                          <Form onSubmit={onRequestOrganizer}>
                            <div className="d-flex gap-2">
                              <Button type="submit" variant="success">Gửi yêu cầu</Button>
                              <Button 
                                type="button" 
                                variant="secondary" 
                                onClick={() => {
                                  setShowOrganizerForm(false);
                                }}
                              >
                                Hủy
                              </Button>
                            </div>
                          </Form>
                        )}
                      </>
                    )}
                  </>
                )}
                {user?.role === 'ORGANIZER' && (
                  <Alert variant="info">
                    Bạn đã là nhà tổ chức sự kiện
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default UserProfile;


