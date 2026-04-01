const express = require("express");
const router = express.Router();

// Import your route modules
const savedBarsRoutes = require("./SavedBars");
// const userRoutes = require("./User"); // Uncomment and create if needed
// const eventRoutes = require("./Events"); // Uncomment and create if needed

// Mount them under their own paths
router.use("/savedbars", savedBarsRoutes);
// router.use("/users", userRoutes);
// router.use("/events", eventRoutes);

module.exports = router;
