const jsonServer = require("json-server");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults({
  logger: true,
  bodyParser: true,
});

// ─────────────────────────────────────────────
// Middlewares
// ─────────────────────────────────────────────
server.use(middlewares);

// Enable CORS for React frontend
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  next();
});

// ─────────────────────────────────────────────
// Custom Routes / Enhancements
// ─────────────────────────────────────────────

// Auto-add createdAt for trades
server.post("/trades", (req, res, next) => {
  if (!req.body.createdAt) {
    req.body.createdAt = new Date().toISOString();
  }
  next();
});

// Optional: validate required fields
server.post("/trades", (req, res, next) => {
  const { trader, date, entry, stopLoss, takeProfit } = req.body;

  if (!trader || !date || !entry || !stopLoss || !takeProfit) {
    return res.status(400).json({
      error: "Missing required trade fields",
    });
  }
  next();
});

// ─────────────────────────────────────────────
// API Router
// ─────────────────────────────────────────────
server.use("/", router);

// ─────────────────────────────────────────────
// Server
// ─────────────────────────────────────────────
const PORT = 4000;

server.listen(PORT, () => {
  console.log(`🚀 Trade Journal API running at http://localhost:${PORT}`);
});
