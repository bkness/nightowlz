const express = require("express");
const axios = require("axios");

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

module.exports = router;
