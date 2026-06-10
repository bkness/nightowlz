const express = require("express");
const Event = require("../../models/Event");
const Bar = require("../../models/Bar");
const { verifyToken } = require("../../middleware/auth");

const router = express.Router();

const EVENT_CATEGORIES = Event.EVENT_CATEGORIES || [];

function parseDate(value) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

// Loads the bar and confirms the requester owns it. Returns the bar or sends an error.
async function loadOwnedBar(barId, userId, res) {
    const bar = await Bar.findById(barId);
    if (!bar) {
        res.status(404).json({ message: "Bar not found." });
        return null;
    }
    if (bar.ownerId.toString() !== userId) {
        res.status(403).json({ message: "Not authorized for this bar." });
        return null;
    }
    return bar;
}

// GET /api/events?barId=...  — upcoming events for a bar (public)
router.get("/", async (req, res) => {
    try {
        const { barId, includePast } = req.query;
        if (!barId) {
            return res.status(400).json({ message: "barId query param is required." });
        }

        const filter = { barId };
        if (includePast !== "true") {
            // Show events that haven't fully ended yet (endsAt, or startsAt if no end).
            filter.$or = [
                { endsAt: { $gte: new Date() } },
                { endsAt: null, startsAt: { $gte: new Date() } },
            ];
        }

        const events = await Event.find(filter).sort({ startsAt: 1 }).lean();
        res.json({ events });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch events." });
    }
});

// POST /api/events — create (owner of the bar only; bar must be verified)
router.post("/", verifyToken, async (req, res) => {
    try {
        const { barId, title, description, category, startsAt, endsAt } = req.body;

        if (!barId || !title || !startsAt) {
            return res.status(400).json({ message: "barId, title, and startsAt are required." });
        }

        const bar = await loadOwnedBar(barId, req.user.id, res);
        if (!bar) return;

        if (!bar.verified) {
            return res.status(403).json({
                message: "Your venue must be verified before publishing events. Contact support.",
            });
        }

        const start = parseDate(startsAt);
        if (!start) {
            return res.status(400).json({ message: "startsAt is not a valid date." });
        }
        const end = parseDate(endsAt);
        if (end && end < start) {
            return res.status(400).json({ message: "endsAt cannot be before startsAt." });
        }

        const cleanCategory = EVENT_CATEGORIES.includes(category) ? category : "other";

        const event = await Event.create({
            barId,
            title,
            description,
            category: cleanCategory,
            startsAt: start,
            endsAt: end,
            createdBy: req.user.id,
        });

        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /api/events/:id — update (owner of the bar only)
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found." });

        const bar = await loadOwnedBar(event.barId, req.user.id, res);
        if (!bar) return;

        const { title, description, category, startsAt, endsAt } = req.body;

        if (title !== undefined) event.title = title;
        if (description !== undefined) event.description = description;
        if (category !== undefined) {
            event.category = EVENT_CATEGORIES.includes(category) ? category : "other";
        }
        if (startsAt !== undefined) {
            const start = parseDate(startsAt);
            if (!start) return res.status(400).json({ message: "startsAt is not a valid date." });
            event.startsAt = start;
        }
        if (endsAt !== undefined) {
            event.endsAt = parseDate(endsAt);
        }
        if (event.endsAt && event.endsAt < event.startsAt) {
            return res.status(400).json({ message: "endsAt cannot be before startsAt." });
        }

        await event.save();
        res.json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /api/events/:id — delete (owner of the bar only)
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found." });

        const bar = await loadOwnedBar(event.barId, req.user.id, res);
        if (!bar) return;

        await event.deleteOne();
        res.json({ message: "Event deleted." });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
