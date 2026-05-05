const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/connection");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use(express.json());

app.use("/api", require("./routes/api"));

app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON payload." });
  }
  return next(err);
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled server error:", err.message);
  res.status(500).json({ message: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
