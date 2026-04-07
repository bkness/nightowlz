const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/bars", require("./bars"));
router.use("/maps", require("./maps"));
router.use("/saved-bars", require("./savedBars"));

module.exports = router;
