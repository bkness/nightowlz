const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connection");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api", require("./routes/api"));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
