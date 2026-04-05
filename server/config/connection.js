// require("dotenv").config();
// const mongoose = require("mongoose");

// console.log("Connecting to:", process.env.MONGODB_URI);
// mongoose.connect(process.env.MONGODB_URI || "MONGODB_URI");

// module.exports = mongoose.connection;

// /server/config/connection.js
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not configured");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
