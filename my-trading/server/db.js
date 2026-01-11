import mongoose from "mongoose";
import dotenv from "dotenv";

// load env variables FIRST
dotenv.config();

console.log("MONGO_URI:", process.env.MONGO_URI); // debug

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
