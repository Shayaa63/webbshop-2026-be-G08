app.use(cors({ origin: '' }));


import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import plantsRouter from "./routes/plants.js";
import tradesRouter from "./routes/trades.js";
import authRouter from "./routes/auth.js";

const app = express();

// Allow all connections (temporary)
app.use(cors({ origin: '' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Webbshop API", stack: "MEN (MongoDB, Express, Node.js)" });
});
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/plants", plantsRouter);
app.use("/trades", tradesRouter);
app.use("/auth", authRouter);

export default app;