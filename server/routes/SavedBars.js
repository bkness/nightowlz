const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/save-bar", async (req, res) => {
  const { userId, barId } = req.body;

  const user = await User.findById(userId);

  if (!user.savedBars.includes(barId)) {
    user.savedBars.push(barId);
    await user.save();
  }

  res.json(user);
});

module.exports = router;
