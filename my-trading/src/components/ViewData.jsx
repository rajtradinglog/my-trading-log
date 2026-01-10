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

export default function ViewData() {
  const navigate = useNavigate();
  const location = useLocation();
  const trader = location.state?.trader || "Guest";

  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH TRADES ---------------- */
  useEffect(() => {
    async function fetchTrades() {
      try {
        const res = await fetch(
          `http://localhost:4000/trades?trader=${trader}`
        );
        const data = await res.json();
        setTrades(data || []);
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

  /* ---------------- SUMMARY CONFIG ---------------- */
  const summaryCards = [
    { label: "Total Trades", value: stats.total },
    { label: "Wins", value: stats.wins, className: "text-success" },
    { label: "Losses", value: stats.losses, className: "text-danger" },
    { label: "Win Rate", value: `${stats.winRate}%` },
  ];

  /* ---------------- CHART DATA ---------------- */
  const rrChartData = trades.map((t, index) => ({
    trade: index + 1,
    rr: Number(t.rrRatio) || 0,
  }));

  const resultChartData = [
    { name: "Wins", value: stats.wins },
    { name: "Losses", value: stats.losses },
  ];

  /* ---------------- CHART CONFIG ---------------- */
  const charts = [
    {
      title: "R:R Progression",
      col: 8,
      render: (
        <LineChart data={rrChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="trade" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="rr" strokeWidth={2} />
        </LineChart>
      ),
    },
    {
      title: "Win / Loss Breakdown",
      col: 4,
      render: (
        <BarChart data={resultChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      ),
    },
  ];

  /* ---------------- UI ---------------- */
  return (
    <div className="view-data-container container ">
      {/* TOP BAR */}
      <div className="view-data-top-bar d-flex justify-content-between align-items-center mb-3">
        <div className="view-data-trader-label">
          Trader: <strong>{trader}</strong>
        </div>

        <Button
          variant="outline-dark"
          size="sm"
          onClick={() => navigate("/")}
        >
          View Form
        </Button>
      </div>

      {/* SUMMARY */}
      <Row className="view-data-summary  g-3 mb-4">
        {summaryCards.map((card) => (
          <Col xs={6} md={3} key={card.label}>
            <Card className="summary-card">
              <Card.Body>
                <small>{card.label}</small>
                <h4 className={card.className || ""}>{card.value}</h4>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-5">
          <Spinner />
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && trades.length === 0 && (
        <Card className="view-data-empty">
          <Card.Body className="text-center text-muted">
            No trades found for this trader.
          </Card.Body>
        </Card>
      )}

      {/* CHARTS */}
      {!loading && trades.length > 0 && (
        <Row className="mb-4">
          {charts.map((chart) => (
            <Col md={chart.col} key={chart.title}>
              <Card className="view-data-chart-card">
                <Card.Header>{chart.title}</Card.Header>
                <Card.Body style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    {chart.render}
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
