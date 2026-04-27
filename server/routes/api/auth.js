const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/User");

const router = express.Router();
const VALID_ROLES = new Set(["user", "owner"]);

function sanitizeRole(role) {
  if (typeof role !== "string") return null;
  const normalized = role.trim().toLowerCase();
  return VALID_ROLES.has(normalized) ? normalized : null;
}

function toPublicUser(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
}

function signToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
}

// Register
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const cleanUsername = typeof username === "string" ? username.trim() : "";
    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const cleanPassword = typeof password === "string" ? password : "";
    const cleanRole = sanitizeRole(role) || "user";

    if (!cleanUsername || !cleanEmail || !cleanPassword) {
      return res.status(400).json({ message: "Username, email, and password are required." });
    }

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_RE.test(cleanEmail)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    if (cleanPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const existingUser = await User.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }],
    });

    if (existingUser) {
      return res.status(409).json({ message: "Username or email is already in use." });
    }

    const hashed = await bcrypt.hash(cleanPassword, 12);
    const user = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      password: hashed,
      role: cleanRole,
    });

    const token = signToken(user);
    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { identifier, password, role } = req.body;

  try {
    const cleanIdentifier = typeof identifier === "string" ? identifier.trim() : "";
    const cleanPassword = typeof password === "string" ? password : "";
    const requestedRole = sanitizeRole(role);

    if (!cleanIdentifier || !cleanPassword) {
      return res.status(400).json({ message: "Identifier and password are required." });
    }

    const user = await User.findOne({
      $or: [
        { email: cleanIdentifier.toLowerCase() },
        { username: cleanIdentifier },
      ],
    });

    if (!user)
      return res.status(404).json({ message: "User or Email not found" });

    if (requestedRole && user.role !== requestedRole) {
      return res.status(403).json({ message: "Role does not match this account." });
    }

    const valid = await bcrypt.compare(cleanPassword, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const token = signToken(user);
    res.json({ token, user: toPublicUser(user) });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



module.exports = router;
