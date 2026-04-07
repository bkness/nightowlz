const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const SavedBar = require("../../models/SavedBar");
const { verifyToken } = require("../../middleware/auth");

function resolveUserId(req) {
    const authHeader = req.headers.authorization || "";

    if (authHeader) {
        if (!authHeader.startsWith("Bearer ")) {
            return { error: "Authorization token required." };
        }

        if (!process.env.JWT_SECRET) {
            return { error: "Server misconfiguration: JWT_SECRET not set.", status: 500 };
        }

        try {
            const token = authHeader.slice(7);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return { userId: decoded.id };
        } catch {
            return { error: "Invalid or expired token." };
        }
    }

    return { userId: req.query.userId || null };
}

// GET /api/saved-bars?userId=X
router.get("/", async (req, res) => {
    const { userId, error, status = 401 } = resolveUserId(req);
    if (error) {
        return res.status(status).json({ message: error });
    }

    if (!userId) return res.json({ bars: [] });

    try {
        const bars = await SavedBar.find({ userId }).sort({ createdAt: -1 }).lean();
        res.json({ bars });
    } catch {
        res.status(500).json({ message: "Failed to fetch saved bars." });
    }
});

// POST /api/saved-bars — save a bar
router.post("/", verifyToken, async (req, res) => {
    const { barId, name, vibe, neighborhood, category, openingHours, lat, lon, source } = req.body;
    if (!barId || !name) return res.status(400).json({ message: "barId and name are required." });
    try {
        await SavedBar.findOneAndUpdate(
            { userId: req.user.id, barId },
            { userId: req.user.id, barId, name, vibe, neighborhood, category, openingHours, lat, lon, source },
            { upsert: true, new: true }
        );
        const bars = await SavedBar.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
        res.json({ bars });
    } catch {
        res.status(500).json({ message: "Failed to save bar." });
    }
});

// DELETE /api/saved-bars/:barId
router.delete("/:barId", verifyToken, async (req, res) => {
    try {
        await SavedBar.deleteOne({ userId: req.user.id, barId: req.params.barId });
        const bars = await SavedBar.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
        res.json({ bars });
    } catch {
        res.status(500).json({ message: "Failed to remove bar." });
    }
});

module.exports = router;
