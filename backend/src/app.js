const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");

app.use(express.json());
app.use(cookieParser());
// Allow requests from the frontend dev server and allow cookies
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// simple health
app.get("/health", (req, res) => res.json({ ok: true }));

module.exports = app;
