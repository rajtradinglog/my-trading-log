import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Spinner } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { APPLICATION_URL } from "../config.js";

export default function ViewData({traderState}) {
  const navigate = useNavigate();
  const location = useLocation();
  const trader = traderState || "Guest";

  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH TRADES (ONLY CHANGE) ---------------- */
  useEffect(() => {
    async function fetchTrades() {
      try {
        const res = await fetch(
          `${APPLICATION_URL}/api/trades?trader=${encodeURIComponent(trader)}`
        );
        const data = await res.json();
        setTrades(data || []);
        console.log("Fetched trades:", data); // debug
      } catch {
        setTrades([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTrades();
  }, [trader]);

  /* ---------------- METRICS ---------------- */
  const stats = useMemo(() => {
    const wins = trades.filter((t) => t.result === "WIN").length;
    const losses = trades.filter((t) => t.result === "LOSS").length;

    return {
      total: trades.length,
      wins,
      losses,
      winRate: trades.length
        ? ((wins / trades.length) * 100).toFixed(1)
        : 0,
    };
  }, [trades]);

  /* ---------------- UI (UNCHANGED) ---------------- */
  return (
    <div className="view-data-container container mt-4 mb-5">
      <div className="view-data-top-bar d-flex justify-content-between align-items-center mb-3">
        <div className="view-data-trader-label">
          Trader: <strong>{trader}</strong>
        </div>

        <Button
          variant="outline-dark"
          size="sm"
          className="view-data-form-btn"
          onClick={() => navigate("/")}
        >
          View Form
        </Button>
      </div>

      <Row className="view-data-summary mb-4">
        <Col xs={6} md={3}>
          <Card className="summary-card">
            <Card.Body>
              <small>Total Trades</small>
              <h4>{stats.total}</h4>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={6} md={3}>
          <Card className="summary-card">
            <Card.Body>
              <small>Wins</small>
              <h4 className="text-success">{stats.wins}</h4>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={6} md={3}>
          <Card className="summary-card">
            <Card.Body>
              <small>Losses</small>
              <h4 className="text-danger">{stats.losses}</h4>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={6} md={3}>
          <Card className="summary-card">
            <Card.Body>
              <small>Win Rate</small>
              <h4>{stats.winRate}%</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {loading && (
        <div className="text-center py-5">
          <Spinner />
        </div>
      )}

      {!loading && trades.length === 0 && (
        <Card className="view-data-empty">
          <Card.Body className="text-center text-muted">
            No trades found for this trader.
          </Card.Body>
        </Card>
      )}

      {!loading && trades.length > 0 && (
        <Row className="mb-4">
          <Col md={8}>
            <Card className="view-data-chart-card">
              <Card.Header>R:R Progression</Card.Header>
              <Card.Body style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trades.map((t, i) => ({
                      trade: i + 1,
                      rr: Number(t.rrRatio) || 0,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="trade" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="rr" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="view-data-chart-card">
              <Card.Header>Win / Loss Breakdown</Card.Header>
              <Card.Body style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Wins", value: stats.wins },
                      { name: "Losses", value: stats.losses },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
