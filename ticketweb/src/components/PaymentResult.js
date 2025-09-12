import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { authApis, endpoints } from '../configs/Apis';

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const PaymentResult = () => {
  const query = useQuery();
  const success = query.get('success') === 'true';
  const method = query.get('method');
  const orderId = query.get('orderId');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    const fetchPayment = async () => {
      if (!orderId) return;
      try {
        setLoading(true);
        setError(null);
          const res = await authApis().get(endpoints.paymentDetail(orderId));
          setPayment(res.data);
      } catch (e) {
        setError('Không tải được thông tin đơn thanh toán');
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [orderId]);

  return (
    <div className="container py-5" style={{ minHeight: '60vh' }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="text-center mb-4">
            {success ? (
              <div className="text-success">
                <i className="bi bi-check-circle-fill" style={{ fontSize: 64 }}></i>
                <h2 className="mt-3">Thanh toán thành công</h2>
                <p className="text-muted">Cảm ơn bạn đã mua vé. Chúc bạn có trải nghiệm tuyệt vời!</p>
              </div>
            ) : (
              <div className="text-danger">
                <i className="bi bi-x-circle-fill" style={{ fontSize: 64 }}></i>
                <h2 className="mt-3">Thanh toán thất bại</h2>
                <p className="text-muted">Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.</p>
              </div>
            )}
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded">
                    <div className="text-muted small">Phương thức</div>
                    <div className="fw-semibold">{method || 'N/A'}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded">
                    <div className="text-muted small">Mã đơn</div>
                    <div className="fw-semibold">{orderId || 'Không có'}</div>
                  </div>
                </div>
              </div>

              <div className="row g-3 mt-1">
                {loading && <div className="col-12">Đang tải thông tin đơn...</div>}
                {error && <div className="col-12 text-danger">{error}</div>}

                {payment && (
                  <>
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded h-100">
                        <div className="text-muted small">Số tiền</div>
                        <div className="fw-bold text-success fs-5">{payment.totalAmount?.toLocaleString('vi-VN')} VND</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded h-100">
                        <div className="text-muted small">Trạng thái</div>
                        <div className="fw-semibold">{payment.status}</div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="p-3 bg-light rounded">
                        <div className="text-muted small">Mã giao dịch</div>
                        <div>
                          {payment.transactionCode ? (
                            <code className="small" style={{ wordBreak: 'break-all' }}>{payment.transactionCode}</code>
                          ) : '—'}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="d-flex flex-wrap gap-2 mt-4">
                <Link className="btn btn-primary" to="/">Về trang chủ</Link>
                <Link className="btn btn-outline-success" to="/secure/tickets">Vé của tôi</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;


