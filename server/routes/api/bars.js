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

router.get("/owner/:ownerId", async (req, res) => {
    try {
        const bar = await Bar.findOne({ ownerId: req.params.ownerId }).sort({ updatedAt: -1 });

        if (!bar) {
            return res.status(404).json({ message: "No bar found for this owner." });
        }

        return res.json(bar);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to load owner bar.",
            error: error.message,
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const bar = await Bar.findById(req.params.id);

        if (!bar) {
            return res.status(404).json({ message: "Bar not found." });
        }

        return res.json(bar);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to load bar.",
            error: error.message,
        });
    }
});

router.post("/", verifyToken, async (req, res) => {
    try {
        const {
            name,
            location,
            description,
            phone,
            website,
            openingHours,
            ownerId,
        } = req.body;

        if (!name?.trim() || !location?.trim() || !ownerId) {
            return res.status(400).json({
                message: "Name, location, and ownerId are required.",
            });
        }

        const bar = await Bar.create({
            name: name.trim(),
            location: location.trim(),
            description: description?.trim() || "",
            phone: phone?.trim() || "",
            website: website?.trim() || "",
            openingHours: openingHours?.trim() || "",
            ownerId,
        });

        return res.status(201).json(bar);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create bar.",
            error: error.message,
        });
    }
});

router.put("/:id", verifyToken, async (req, res) => {
    try {
        const {
            name,
            location,
            description,
            phone,
            website,
            openingHours,
        } = req.body;

        const updates = {
            name: typeof name === "string" ? name.trim() : name,
            location: typeof location === "string" ? location.trim() : location,
            description: typeof description === "string" ? description.trim() : description,
            phone: typeof phone === "string" ? phone.trim() : phone,
            website: typeof website === "string" ? website.trim() : website,
            openingHours: typeof openingHours === "string" ? openingHours.trim() : openingHours,
        };

        const bar = await Bar.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        });

        if (!bar) {
            return res.status(404).json({ message: "Bar not found." });
        }

        return res.json(bar);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update bar.",
            error: error.message,
        });
    }
});

module.exports = router;
