import React, { useEffect, useState } from 'react';
import { authApis, endpoints } from '../configs/Apis';
import { Link } from 'react-router-dom';

const formatVnd = (n) =>
  typeof n === 'number' ? n.toLocaleString('vi-VN') + ' VND' : '—';

const StatusBadge = ({ status }) => {
  const map = {
    SUCCESS: 'success',
    FAILED: 'danger',
    PENDING: 'secondary',
    PROCESSING: 'warning'
  };
  const cls = map[status] || 'secondary';
  return <span className={`badge bg-${cls}`}>{status || 'N/A'}</span>;
};

const PaymentsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await authApis().get(endpoints.myPayments);
        setItems(res.data || []);
      } catch (e) {
        setError('Không tải được danh sách đơn thanh toán');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="container py-4" style={{ minHeight: '60vh' }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="m-0">Đơn thanh toán của tôi</h5>
      </div>

      {loading && <div>Đang tải...</div>}
      {error && <div className="text-danger">{error}</div>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Mã đơn</th>
                <th>Mã giao dịch</th>
                <th>Phương thức</th>
                <th>Số tiền</th>
                <th>Trạng thái</th>
                <th>Thời gian</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">Chưa có đơn thanh toán</td>
                </tr>
              )}
              {items.map((p, idx) => (
                <tr key={p.id}>
                  <td>{idx + 1}</td>
                  <td>{p.id}</td>
                  <td style={{maxWidth: '200px'}}><code className="small">{p.transactionCode || '—'}</code></td>
                  <td>{p.method}</td>
                  <td>{formatVnd(p.totalAmount)}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>{p.createdAt ? new Date(p.createdAt).toLocaleString('vi-VN') : '—'}</td>
                  <td>
                    <Link className="btn btn-sm btn-outline-primary" to={`/payment/result?success=${p.status === 'SUCCESS'}&method=${p.method}&orderId=${p.id}`}>
                      Xem
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;


