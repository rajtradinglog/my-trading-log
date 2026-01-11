import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import tradesRoutes from "../server/routes/tradeRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/trades", tradesRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
