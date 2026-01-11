import express from "express";
import Trade from "../models/Trade.js";

const router = express.Router();

/**
 * GET /api/trades?trader=RAJMOHAN
 */
router.get("/", async (req, res) => {
  try {
    const { trader } = req.query;

    const query = {};
    if (trader) {
      query.trader = trader;
    }

    const trades = await Trade.find(query).sort({ createdAt: -1 });
        console.log("GET /api/trades query =", query);
           console.log("found trades:", trades.length);
    res.status(200).json(trades);
  } catch (error) {
    console.error("Fetch trades error:", error);
    res.status(500).json({ error: "Failed to fetch trades" });
  }
});

/**
 * POST /api/trades
 */
router.post("/", async (req, res) => {
  try {
    const trade = await Trade.create(req.body);
    res.status(201).json(trade);
  } catch (error) {
    console.error("Create trade error:", error);
    res.status(500).json({ error: "Failed to create trade" });
  }
});

/**
 * DELETE /api/trades/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    await Trade.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete trade error:", error);
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;
