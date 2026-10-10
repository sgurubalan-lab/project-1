require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const todoRoutes = require("./routes/todos");

const app = express();
app.use(cors());
app.use(express.json());

// Reuse the connection across serverless invocations
let connection;
async function connectDB() {
  if (!connection) connection = mongoose.connect(process.env.MONGODB_URI);
  return connection;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    connection = undefined;
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/todos", todoRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

if (require.main === module) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`API running on port ${port}`));
}

module.exports = app;
