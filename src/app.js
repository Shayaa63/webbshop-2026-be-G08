import "dotenv/config";
import express from "express";
import plantsRouter from "./routes/plants.js";
import tradesRouter from "./routes/trades.js";
import authRouter from "./routes/auth.js";
import cors from "cors";

const app = express();

// Middleware
app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
