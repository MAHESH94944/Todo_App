const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// simple health
app.get("/health", (req, res) => res.json({ ok: true }));

module.exports = app;
