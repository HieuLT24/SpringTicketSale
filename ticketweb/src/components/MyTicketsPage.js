import React, { useEffect, useState } from 'react';
import { authApis, endpoints } from '../configs/Apis';

const formatVnd = (n) => typeof n === 'number' ? n.toLocaleString('vi-VN') + ' VND' : '—';

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await authApis().get(endpoints.myTickets);
        setTickets(res.data || []);
      } catch (e) {
        setError('Không tải được danh sách vé');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="container py-4" style={{ minHeight: '60vh' }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="m-0">Vé của tôi</h5>
      </div>

      {loading && <div>Đang tải...</div>}
      {error && <div className="text-danger">{error}</div>}

      {!loading && !error && (
        <>
          {tickets.length === 0 && (
            <div className="text-center text-muted py-5">Chưa có vé</div>
          )}

          {Object.entries(
            tickets.reduce((acc, t) => {
              const key = t.eventShowName || `Sự kiện #${t.eventShowId || '-'}`;
              if (!acc[key]) acc[key] = [];
              acc[key].push(t);
              return acc;
            }, {})
          ).map(([eventName, group]) => (
            <div key={eventName} className="mb-4">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-calendar-event text-primary me-2"></i>
                <h6 className="m-0 fw-bold">{eventName}</h6>
              </div>
              <div className="row g-3">
                {group.map((t) => (
                  <div className="col-md-4" key={t.id}>
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="card-title m-0">Vé #{t.id}</h6>
                          <span className="badge bg-secondary">{t.status || 'N/A'}</span>
                        </div>
                        <div className="mb-1">Ghế: <strong>{t.seatNumber || '—'}</strong></div>
                        <div className="mb-1">Giá: <strong className="text-success">{formatVnd(t.price)}</strong></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default MyTicketsPage;


