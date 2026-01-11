import mongoose from "mongoose";

const TradeSchema = new mongoose.Schema(
  {
    trader: { type: String, required: true },

    date: {
      type: Date,
      required: true,
    },

    pair: {
      type: String,
      required: true,
    },

    direction: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },

    entry: {
      type: Number,
      required: true,
    },

    stopLoss: {
      type: Number,
      required: true,
    },

    takeProfit: {
      type: Number,
      required: true,
    },

    result: {
      type: String,
      enum: ["WIN", "LOSS", "BREAKEVEN"],
    },

    notes: {
      type: String,
      default: "",
    },

    riskPips: Number,
    rewardPips: Number,
    rrRatio: Number,
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const Trade = mongoose.model("Trade", TradeSchema);

export default Trade;
