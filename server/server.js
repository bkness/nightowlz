const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connection");
const apiRoutes = require("./routes/api");
const port = process.env.PORT || 3001;

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount all API routes under /api
app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`BarFly server running on port ${port}`);
});
