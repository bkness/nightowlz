const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true, service: "barfly-server" });
});

app.listen(PORT, () => {
  console.log(`BarFly server running on port ${PORT}`);
});
