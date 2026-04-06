const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/bars", require("./bars"));
router.use("/maps", require("./maps"));
router.use("/saved-bars", require("./savedBars"));
// router.use("/events", require("./Events"));
// router.use("/users", require("./Users"));
// router.use("/bars", require("./Bars"));
// router.use("/users", require("./users"));
// router.use("/bars", require("./bars"));

module.exports = router;
