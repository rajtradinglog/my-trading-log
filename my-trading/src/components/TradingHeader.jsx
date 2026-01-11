import React, { useState } from "react";
import {
  Navbar,
  Container,
  NavDropdown,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

function TradingHeader({ onUserChange }) {
  const MAX_TRADERS = 3;

  const [traders, setTraders] = useState(["RAJMOHAN"]);
  const [selectedUser, setSelectedUser] = useState("RAJMOHAN");

  const [showModal, setShowModal] = useState(false);
  const [newTraderName, setNewTraderName] = useState("");
  const [error, setError] = useState("");

  const allUsers = [...traders, "Guest"];

  const navigate = useNavigate();
  const location = useLocation();

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    onUserChange(user);

    // If already on /view-data, re-navigate so ViewData can react
    if (location.pathname === "/view-data") {
      navigate("/view-data", { replace: true });
    }
  };

  const handleAddTrader = () => {
    const name = newTraderName.trim();

    if (!name) return setError("Trader name required");
    if (traders.includes(name)) return setError("Trader already exists");
    if (traders.length >= MAX_TRADERS)
      return setError("Maximum 3 traders allowed");

    setTraders([...traders, name]);
    handleSelectUser(name);
    setShowModal(false);
    setNewTraderName("");
    setError("");
  };

  return (
    <>
      <header className="trading-header">
        <Navbar bg="dark" variant="dark" className="trading-header-navbar">
          <Container fluid className="trading-header-container">
            <Navbar.Brand className="trading-header-brand fw-bold">
              MY TRADING LOG
            </Navbar.Brand>

            <NavDropdown
              title={selectedUser}
              align="end"
              menuVariant="dark"
              className="trading-header-dropdown"
            >
              {allUsers.map((user) => (
                <NavDropdown.Item
                  key={user}
                  active={user === selectedUser}
                  onClick={() => handleSelectUser(user)}
                  className="trading-header-dropdown-item"
                >
                  {user}
                </NavDropdown.Item>
              ))}

              <NavDropdown.Divider />

              <NavDropdown.Item
                disabled={traders.length >= MAX_TRADERS}
                onClick={() => setShowModal(true)}
              >
                Add New Trader
              </NavDropdown.Item>
            </NavDropdown>
          </Container>
        </Navbar>
      </header>

      {/* ADD TRADER MODAL */}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setError("");
          setNewTraderName("");
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Trader</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Control
            placeholder="Trader name"
            value={newTraderName}
            onChange={(e) => setNewTraderName(e.target.value)}
          />
          {error && <div className="text-danger mt-2">{error}</div>}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddTrader}>Add</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TradingHeader;