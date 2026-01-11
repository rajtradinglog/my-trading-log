import { useState, useEffect, useMemo } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { APPLICATION_URL } from "../config.js";
import "react-toastify/dist/ReactToastify.css";
import "../assets/styles/TradeJournalForm.scss";

/* ---------------- CONSTANTS ---------------- */

const initialForm = {
  trader: "",
  date: new Date().toISOString().slice(0, 10),
  pair: "EURUSD",
  direction: "BUY",
  entry: "",
  stopLoss: "",
  takeProfit: "",
  result: "WIN",
  notes: "",
};

const BASIC_FIELDS = [
  { label: "Date", name: "date", type: "date", col: 4 },
  {
    label: "Pair",
    name: "pair",
    type: "select",
    col: 4,
    options: ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD"],
  },
];

const PRICE_FIELDS = [
  { label: "Entry", name: "entry" },
  { label: "Stop Loss", name: "stopLoss" },
  { label: "Take Profit", name: "takeProfit" },
];

const DIRECTIONS = ["BUY", "SELL"];
const RESULT_OPTIONS = ["WIN", "LOSS", "BREAKEVEN"];

/* ---------------- COMPONENT ---------------- */

export default function TradeJournalForm({ trader }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isViewDataPage = location.pathname === "/view-data";

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- SYNC TRADER ---------------- */
  useEffect(() => {
    setForm((prev) => ({ ...prev, trader }));
  }, [trader]);

  /* ---------------- CALCULATIONS ---------------- */
  const numbers = useMemo(
    () => ({
      entry: parseFloat(form.entry),
      sl: parseFloat(form.stopLoss),
      tp: parseFloat(form.takeProfit),
    }),
    [form.entry, form.stopLoss, form.takeProfit]
  );

  const riskPips =
    !isNaN(numbers.entry) && !isNaN(numbers.sl)
      ? Math.abs(numbers.entry - numbers.sl).toFixed(2)
      : "";

  const rewardPips =
    !isNaN(numbers.entry) && !isNaN(numbers.tp)
      ? Math.abs(numbers.tp - numbers.entry).toFixed(2)
      : "";

  const rrRatio =
    riskPips && rewardPips && Number(riskPips) !== 0
      ? (rewardPips / riskPips).toFixed(2)
      : "";

  const metrics = [
    { label: "Risk", value: riskPips },
    { label: "Reward", value: rewardPips },
    { label: "R:R", value: rrRatio },
  ];

  /* ---------------- HANDLERS ---------------- */
  const handleToggleView = () => {
    navigate(isViewDataPage ? "/" : "/view-data", {
      state: { trader },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${APPLICATION_URL}/api/trades`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          riskPips: riskPips || null,
          rewardPips: rewardPips || null,
          rrRatio: rrRatio || null,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Trade logged successfully", { autoClose: 3000 });
      setForm({ ...initialForm, trader });
    } catch {
      toast.error("Failed to log trade", { autoClose: 3000 });
    } finally {
      setSubmitting(false);
    }
  };

  const disableSubmit =
    !form.date ||
    !form.entry ||
    !form.stopLoss ||
    !form.takeProfit ||
    submitting ||
    trader === "Guest";

  /* ---------------- UI ---------------- */
  return (
    <div className="trade-journal-container trade-journal tj-container">
      {/* TOP BAR */}
      <div className="trade-journal-topbar trade-journal-header-bar tj-topbar">
        <strong className="trade-journal-welcome trade-journal-user tj-user-text">
          Welcome, {trader}
        </strong>
      </div>

      <Card className="trade-journal-card trade-journal-main-card tj-main-card">
        <Card.Header className="trade-journal-header trade-journal-card-header tj-card-header">
          <div className="card-text trade-journal-header-text tj-header-text">
            <h4 className="trade-journal-title trade-journal-heading tj-heading">
              Intraday Forex Trade Log
            </h4>

            <p className="trade-journal-trader trade-journal-subtitle text-muted tj-subtitle">
              Trader: <strong>{trader}</strong>
            </p>
          </div>

          <Button
            size="sm"
            variant="outline-dark"
            onClick={handleToggleView}
            className="trade-journal-toggle-btn trade-journal-nav-btn tj-toggle-btn"
          >
            {isViewDataPage ? "View Form" : "View Data"}
          </Button>
        </Card.Header>

        <Card.Body className="trade-journal-body tj-body">
          <Form className="trade-journal-form tj-form" onSubmit={handleSubmit}>
            {/* ROW 1: Date, Pair, Direction */}
            <Row className="trade-form-row trade-journal-row trade-journal-row-basic tj-row tj-row-basic ">
              {BASIC_FIELDS.map((field) => (
                <Col
                  md={field.col}
                  key={field.name}
                  className="trade-journal-col tj-col tj-col-basic"
                >
                  <Form.Group className="trade-journal-field tj-field tj-field-basic">
                    <Form.Label className="trade-journal-label tj-label tj-label-basic">
                      {field.label}
                    </Form.Label>

                    {field.type === "select" ? (
                      <Form.Select
                        className="trade-journal-select tj-select tj-select-pair"
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                      >
                        {field.options.map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </Form.Select>
                    ) : (
                      <Form.Control
                        className="trade-journal-input tj-input tj-input-date"
                        type={field.type}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                      />
                    )}
                  </Form.Group>
                </Col>
              ))}

              <Col md={4} className="trade-journal-col tj-col tj-col-direction">
                <Form.Group className="trade-journal-field tj-field tj-field-direction">
                  <Form.Label className="trade-journal-label tj-label tj-label-direction">
                    Direction
                  </Form.Label>

                  <div className="trade-journal-radio-group tj-radio-group">
                    {DIRECTIONS.map((dir) => (
                      <Form.Check
                        inline
                        key={dir}
                        label={dir}
                        type="radio"
                        name="direction"
                        value={dir}
                        checked={form.direction === dir}
                        onChange={handleChange}
                        className="trade-journal-radio tj-radio tj-radio-direction"
                      />
                    ))}
                  </div>
                </Form.Group>
              </Col>
            </Row>

            {/* ROW 2: Entry / SL / TP */}
            <Row className="trade-form-row trade-journal-row trade-journal-row-price tj-row tj-row-price ">
              {PRICE_FIELDS.map((field) => (
                <Col
                  md={4}
                  key={field.name}
                  className="trade-journal-col tj-col tj-col-price"
                >
                  <Form.Group className="trade-journal-field tj-field tj-field-price">
                    <Form.Label className="trade-journal-label tj-label tj-label-price">
                      {field.label}
                    </Form.Label>

                    <Form.Control
                      className="trade-journal-input tj-input tj-input-price"
                      type="number"
                      step="0.0001"
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>

            {/* METRICS */}
            <Row className=" trade-form-row text-muted trade-journal-metrics tj-metrics-row ">
              {metrics.map((m) => (
                <Col
                  md={4}
                  key={m.label}
                  className="trade-journal-metric tj-metric"
                >
                  {m.label}:{" "}
                  <strong className="trade-journal-metric-value tj-metric-value">
                    {m.value || "-"}
                  </strong>
                </Col>
              ))}
            </Row>

            {/* ROW 3: Result + Notes */}
            <Row className="trade-form-row trade-journal-row trade-journal-row-final tj-row tj-row-final mb-3">
              <Col md={4} className="trade-journal-col tj-col tj-col-result">
                <Form.Group className="trade-journal-field tj-field tj-field-result">
                  <Form.Label className="trade-journal-label tj-label tj-label-result">
                    Result
                  </Form.Label>

                  <Form.Select
                    className="trade-journal-select tj-select tj-select-result"
                    name="result"
                    value={form.result}
                    onChange={handleChange}
                  >
                    {RESULT_OPTIONS.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={8} className="trade-journal-col tj-col tj-col-notes">
                <Form.Group className="trade-journal-field tj-field tj-field-notes">
                  <Form.Label className="trade-journal-label tj-label tj-label-notes">
                    Notes
                  </Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    className="trade-journal-textarea tj-textarea tj-textarea-notes"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* SUBMIT */}
            <div className="d-grid trade-journal-submit tj-submit-container">
              <Button
                type="submit"
                disabled={disableSubmit}
                className="trade-journal-submit-btn tj-submit-btn"
              >
                {submitting ? "Logging..." : "Log Trade"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <ToastContainer />
    </div>
  );
}
