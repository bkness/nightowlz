const express = require("express");
const axios = require("axios");
const Bar = require("../../models/Bar");
const { verifyToken } = require("../../middleware/auth");

const router = express.Router();

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const DEFAULT_RADIUS_METERS = 5000;
const MAX_RADIUS_METERS = 15000;

function toNumber(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function normalizeElement(element) {
    const tags = element.tags || {};
    return {
        osmId: element.id,
        osmType: element.type,
        name: tags.name || "Unnamed Bar",
        category: tags.amenity || "bar",
        lat: element.lat,
        lon: element.lon,
        address: {
            street: tags["addr:street"] || null,
            houseNumber: tags["addr:housenumber"] || null,
            city: tags["addr:city"] || null,
            state: tags["addr:state"] || null,
            postcode: tags["addr:postcode"] || null,
            country: tags["addr:country"] || null,
            full:
                [
                    tags["addr:housenumber"],
                    tags["addr:street"],
                    tags["addr:city"],
                    tags["addr:state"],
                ]
                    .filter(Boolean)
                    .join(" ") || null,
        },
        phone: tags.phone || tags["contact:phone"] || null,
        website: tags.website || tags["contact:website"] || null,
        openingHours: tags.opening_hours || null,
        source: "openstreetmap-overpass",
    };
}

router.get("/search", async (req, res) => {
    try {
        const lat = toNumber(req.query.lat);
        const lon = toNumber(req.query.lon);

        if (lat === null || lon === null) {
            return res.status(400).json({
                message: "lat and lon query params are required and must be numbers.",
            });
        }

        const requestedRadius = toNumber(req.query.radius);
        const radius = Math.max(
            500,
            Math.min(requestedRadius || DEFAULT_RADIUS_METERS, MAX_RADIUS_METERS),
        );

        const query = `
      [out:json][timeout:25];
      (
        node["amenity"~"bar|pub|nightclub"](around:${radius},${lat},${lon});
      );
      out body;
    `;

        const { data } = await axios.post(OVERPASS_URL, query, {
            headers: { "Content-Type": "text/plain" },
            timeout: 20000,
        });

        const elements = Array.isArray(data?.elements) ? data.elements : [];
        const bars = elements
            .filter((el) => typeof el.lat === "number" && typeof el.lon === "number")
            .map(normalizeElement);

        return res.json({
            source: "openstreetmap-overpass",
            count: bars.length,
            query: { lat, lon, radius },
            bars,
        });
    } catch (error) {
        return res.status(502).json({
            message: "Failed to fetch bars from Overpass API.",
            error: error.message,
        });
    }
});

// --- App bar CRUD (MongoDB) ---

// GET /api/bars — all registered bars (public)
router.get("/", async (_req, res) => {
    try {
        const bars = await Bar.find().sort({ createdAt: -1 }).lean();
        res.json(bars);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch bars." });
    }
});

// GET /api/bars/owner/:userId — the bar owned by a user (owner only, own bars)
// Declared before "/:id" so the literal "owner" segment isn't swallowed by the param route.
router.get("/owner/:userId", verifyToken, async (req, res) => {
    try {
        if (req.user.id !== req.params.userId) {
            return res.status(403).json({ message: "Not authorized." });
        }
        const bar = await Bar.findOne({ ownerId: req.params.userId })
            .sort({ createdAt: -1 })
            .lean();
        if (!bar) return res.status(404).json({ message: "No bar found for this owner." });
        res.json(bar);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch owner bar." });
    }
});

// GET /api/bars/:id
router.get("/:id", async (req, res) => {
    try {
        const bar = await Bar.findById(req.params.id).lean();
        if (!bar) return res.status(404).json({ message: "Bar not found." });
        res.json(bar);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch bar." });
    }
});

// POST /api/bars — create (owner only)
router.post("/", verifyToken, async (req, res) => {
    try {
        const { name, location, description, phone, website, openingHours, coordinates } = req.body;
        const bar = await Bar.create({
            name,
            location,
            description,
            phone,
            website,
            openingHours,
            coordinates: coordinates || { lat: null, lng: null },
            ownerId: req.user.id,
        });
        res.status(201).json(bar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /api/bars/:id — update (owner only)
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const bar = await Bar.findById(req.params.id);
        if (!bar) return res.status(404).json({ message: "Bar not found." });
        if (bar.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized." });
        }
        const { name, location, description, phone, website, openingHours, coordinates } = req.body;
        Object.assign(bar, { name, location, description, phone, website, openingHours });
        if (coordinates) bar.coordinates = coordinates;
        await bar.save();
        res.json(bar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
