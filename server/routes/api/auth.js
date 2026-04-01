const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/User");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 5);
    const user = await User.create({ username, email, password: hashed, role });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!user)
      return res.status(404).json({ message: "User or Email not found" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "SECRET_KEY",
    );
    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete user (for testing purposes)
router.delete("/delete/:_id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params._id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
