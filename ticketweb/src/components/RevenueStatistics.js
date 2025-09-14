import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Tabs, Tab, Form } from 'react-bootstrap';
import { authApis, endpoints } from '../configs/Apis';

const RevenueStatistics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('events');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [yearlyLoading, setYearlyLoading] = useState(false);
  const yearlyLoadedRef = useRef(false);
  
  const [eventStats, setEventStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [quarterlyStats, setQuarterlyStats] = useState(null);
  const [yearlyStats, setYearlyStats] = useState(null);
  const [overallStats, setOverallStats] = useState(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const loadYearlyStats = useCallback(async () => {
    if (yearlyLoadedRef.current) return;
    
    try {
      setYearlyLoading(true);
      yearlyLoadedRef.current = true;
      const response = await authApis().get(endpoints.revenueYearly);
      setYearlyStats(response.data);
    } catch (error) {
      setError('Không thể tải thống kê theo năm');
      yearlyLoadedRef.current = false;
    } finally {
      setYearlyLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverallStats();
    loadEventStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'monthly' || activeTab === 'quarterly') {
      loadTimeBasedStats();
    } else if (activeTab === 'yearly' && !yearlyLoadedRef.current) {
      loadYearlyStats();
    }
  }, [activeTab, selectedYear, loadYearlyStats]);

  const loadOverallStats = async () => {
    try {
      setLoading(true);
      const response = await authApis().get(endpoints.revenueOverall);
      setOverallStats(response.data);
    } catch (error) {
      setError('Không thể tải thống kê tổng quan');
    } finally {
      setLoading(false);
    }
  };

  const loadEventStats = async () => {
    try {
      setLoading(true);
      const response = await authApis().get(endpoints.revenueEvents);
      setEventStats(response.data);
    } catch (error) {
      setError('Không thể tải thống kê theo sự kiện');
    } finally {
      setLoading(false);
    }
  };

  const loadTimeBasedStats = async () => {
    try {
      setLoading(true);
      const params = { year: selectedYear };
      
      if (activeTab === 'monthly') {
        const response = await authApis().get(endpoints.revenueMonthly, { params });
        setMonthlyStats(response.data);
      } else if (activeTab === 'quarterly') {
        const response = await authApis().get(endpoints.revenueQuarterly, { params });
        setQuarterlyStats(response.data);
      }
    } catch (error) {
      setError(`Không thể tải thống kê theo ${activeTab === 'monthly' ? 'tháng' : 'quý'}`);
    } finally {
      setLoading(false);
    }
  };


  const formatCurrency = (amount) => {
    return amount ? amount.toLocaleString('vi-VN') + ' VNĐ' : '0 VNĐ';
  };

  const renderEventStats = () => {
    if (!eventStats) return <Spinner animation="border" />;

    const chartData = eventStats.eventRevenues?.map(event => ({
      name: event.eventName,
      revenue: event.revenue,
      ticketsSold: event.ticketsSold
    })) || [];

    return (
      <div>
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h4 className="text-primary">{eventStats.totalEvents || 0}</h4>
                <p className="text-muted mb-0">Tổng sự kiện</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h4 className="text-success">{formatCurrency(eventStats.totalRevenue)}</h4>
                <p className="text-muted mb-0">Tổng doanh thu</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h4 className="text-info">{eventStats.totalTicketsSold || 0}</h4>
                <p className="text-muted mb-0">Tổng vé bán</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h4 className="text-warning">
                  {eventStats.totalEvents > 0 ? formatCurrency(eventStats.totalRevenue / eventStats.totalEvents) : '0 VNĐ'}
                </h4>
                <p className="text-muted mb-0">Doanh thu TB/sự kiện</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Card>
              <Card.Header>
                <h5>Chi tiết doanh thu theo sự kiện</h5>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Tên sự kiện</th>
                        <th>Ngày tổ chức</th>
                        <th>Doanh thu</th>
                        <th>Vé đã bán</th>
                        <th>Sức chứa</th>
                        <th>Giá vé</th>
                        <th>Tỷ lệ bán</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventStats.eventRevenues?.map((event, index) => (
                        <tr key={index}>
                          <td>{event.eventName}</td>
                          <td>{new Date(event.eventDate).toLocaleDateString('vi-VN')}</td>
                          <td className="text-success fw-bold">{formatCurrency(event.revenue)}</td>
                          <td>{event.ticketsSold}</td>
                          <td>{event.capacity}</td>
                          <td>{formatCurrency(event.ticketPrice)}</td>
                          <td>
                            <span className={`badge ${event.capacity > 0 ? (event.ticketsSold / event.capacity) > 0.8 ? 'bg-success' : (event.ticketsSold / event.capacity) > 0.5 ? 'bg-warning' : 'bg-danger' : 'bg-secondary'}`}>
                              {event.capacity > 0 ? `${((event.ticketsSold / event.capacity) * 100).toFixed(1)}%` : 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const renderMonthlyStats = () => {
    if (!monthlyStats) return <Spinner animation="border" />;

    const chartData = monthlyStats.monthlyRevenues?.map(month => ({
      name: month.monthName,
      revenue: month.revenue,
      ticketsSold: month.ticketsSold
    })) || [];

    return (
      <div>
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <h4 className="text-success">{formatCurrency(monthlyStats.totalRevenue)}</h4>
                <p className="text-muted mb-0">Tổng doanh thu năm {selectedYear}</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <h4 className="text-info">{monthlyStats.totalTicketsSold || 0}</h4>
                <p className="text-muted mb-0">Tổng vé bán năm {selectedYear}</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <h4 className="text-warning">{monthlyStats.totalEvents || 0}</h4>
                <p className="text-muted mb-0">Tổng sự kiện năm {selectedYear}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card>
          <Card.Header>
            <h5>Doanh thu theo tháng năm {selectedYear}</h5>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Tháng</th>
                    <th>Doanh thu</th>
                    <th>Vé đã bán</th>
                    <th>Sự kiện</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyStats.monthlyRevenues?.map((month, index) => (
                    <tr key={index}>
                      <td>{month.monthName}</td>
                      <td className="text-success fw-bold">{formatCurrency(month.revenue)}</td>
                      <td>{month.ticketsSold}</td>
                      <td>{month.totalEvents}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  };

  const renderQuarterlyStats = () => {
    if (!quarterlyStats) return <Spinner animation="border" />;

    const chartData = quarterlyStats.quarterlyRevenues?.map(quarter => ({
      name: quarter.quarterName,
      revenue: quarter.revenue,
      ticketsSold: quarter.ticketsSold
    })) || [];

    return (
      <div>
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <h4 className="text-success">{formatCurrency(quarterlyStats.totalRevenue)}</h4>
                <p className="text-muted mb-0">Tổng doanh thu năm {selectedYear}</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <h4 className="text-info">{quarterlyStats.totalTicketsSold || 0}</h4>
                <p className="text-muted mb-0">Tổng vé bán năm {selectedYear}</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <h4 className="text-warning">{quarterlyStats.totalEvents || 0}</h4>
                <p className="text-muted mb-0">Tổng sự kiện năm {selectedYear}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card>
          <Card.Header>
            <h5>Doanh thu theo quý năm {selectedYear}</h5>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Quý</th>
                    <th>Doanh thu</th>
                    <th>Vé đã bán</th>
                    <th>Sự kiện</th>
                  </tr>
                </thead>
                <tbody>
                  {quarterlyStats.quarterlyRevenues?.map((quarter, index) => (
                    <tr key={index}>
                      <td>{quarter.quarterName}</td>
                      <td className="text-success fw-bold">{formatCurrency(quarter.revenue)}</td>
                      <td>{quarter.ticketsSold}</td>
                      <td>{quarter.totalEvents}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  };

  const renderYearlyStats = () => {
    if (yearlyLoading || !yearlyStats) {
      return <Spinner animation="border" />;
    }

    const chartData = yearlyStats.yearlyRevenues?.map(year => ({
      name: year.yearName,
      revenue: year.revenue,
      ticketsSold: year.ticketsSold
    })) || [];

    return (
      <div>
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <h4 className="text-success">{formatCurrency(yearlyStats.totalRevenue)}</h4>
                <p className="text-muted mb-0">Tổng doanh thu tất cả năm</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <h4 className="text-info">{yearlyStats.totalTicketsSold || 0}</h4>
                <p className="text-muted mb-0">Tổng vé bán tất cả năm</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <h4 className="text-warning">{yearlyStats.totalEvents || 0}</h4>
                <p className="text-muted mb-0">Tổng sự kiện tất cả năm</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card>
          <Card.Header>
            <h5>Doanh thu theo năm</h5>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Năm</th>
                    <th>Doanh thu</th>
                    <th>Vé đã bán</th>
                    <th>Sự kiện</th>
                  </tr>
                </thead>
                <tbody>
                  {yearlyStats.yearlyRevenues?.map((year, index) => (
                    <tr key={index}>
                      <td>{year.yearName}</td>
                      <td className="text-success fw-bold">{formatCurrency(year.revenue)}</td>
                      <td>{year.ticketsSold}</td>
                      <td>{year.totalEvents}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  };

  const renderOverallStats = () => {
    if (!overallStats) return <Spinner animation="border" />;

    return (
      <div>
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center bg-primary text-white">
              <Card.Body>
                <h2>{overallStats.totalEvents || 0}</h2>
                <p className="mb-0">Tổng sự kiện</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center bg-success text-white">
              <Card.Body>
                <h2>{formatCurrency(overallStats.totalRevenue)}</h2>
                <p className="mb-0">Tổng doanh thu</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center bg-info text-white">
              <Card.Body>
                <h2>{overallStats.totalTicketsSold || 0}</h2>
                <p className="mb-0">Tổng vé bán</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center bg-warning text-white">
              <Card.Body>
                <h2>
                  {overallStats.totalEvents > 0 ? formatCurrency(overallStats.totalRevenue / overallStats.totalEvents) : '0 VNĐ'}
                </h2>
                <p className="mb-0">Doanh thu TB/sự kiện</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h3 className="mb-0">Thống kê doanh thu</h3>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
              >
                <Tab eventKey="overall" title="Tổng quan">
                  {renderOverallStats()}
                </Tab>
                <Tab eventKey="events" title="Theo sự kiện">
                  {renderEventStats()}
                </Tab>
                <Tab eventKey="monthly" title="Theo tháng">
                  <Row className="mb-3">
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Chọn năm:</Form.Label>
                        <Form.Select
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(e.target.value)}
                        >
                          {Array.from({ length: 5 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return (
                              <option key={year} value={year.toString()}>
                                {year}
                              </option>
                            );
                          })}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  {renderMonthlyStats()}
                </Tab>
                <Tab eventKey="quarterly" title="Theo quý">
                  <Row className="mb-3">
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Chọn năm:</Form.Label>
                        <Form.Select
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(e.target.value)}
                        >
                          {Array.from({ length: 5 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return (
                              <option key={year} value={year.toString()}>
                                {year}
                              </option>
                            );
                          })}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  {renderQuarterlyStats()}
                </Tab>
                <Tab eventKey="yearly" title="Theo năm">
                  {renderYearlyStats()}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RevenueStatistics;
