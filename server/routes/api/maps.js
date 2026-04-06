const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

let cachedAccessToken = null;
let tokenExpiresAt = 0;
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedAccessToken && now < tokenExpiresAt - 60) return cachedAccessToken;

  const key = fs.readFileSync(path.resolve(process.env.APPLE_MAPS_PRIVATE_KEY_PATH));
  const mapsAuthToken = jwt.sign(
    { iss: process.env.APPLE_MAPS_TEAM_ID, iat: now, exp: now + 1800 },
    key,
    { algorithm: "ES256", keyid: process.env.APPLE_MAPS_KEY_ID }
  );

  const { data } = await axios.get("https://maps-api.apple.com/v1/token", {
    headers: { Authorization: `Bearer ${mapsAuthToken}` },
    timeout: 8000,
  });

  cachedAccessToken = data.accessToken;
  tokenExpiresAt = now + data.expiresInSeconds;
  return cachedAccessToken;
}

function normalizeApplePlace(place) {
  const latitude = place.coordinate?.latitude;
  const longitude = place.coordinate?.longitude;
  return {
    barId: place.id || `${latitude},${longitude}`,
    name: place.name || "Unknown",
    category: place.poiCategory || "nightlife",
    vibe: place.poiCategory || "",
    neighborhood: place.formattedAddressLines ? place.formattedAddressLines.join(", ") : "",
    openingHours: "",
    phone: place.phone || "",
    website: place.website || "",
    lat: latitude,
    lon: longitude,
    source: "apple-maps",
  };
}

function normalizeOverpassElement(element) {
  const tags = element.tags || {};
  return {
    barId: String(element.id),
    name: tags.name || "Unnamed Bar",
    category: tags.amenity || "bar",
    vibe: tags.amenity || "",
    neighborhood:
      [
        tags["addr:housenumber"],
        tags["addr:street"],
        tags["addr:city"],
        tags["addr:state"],
      ]
        .filter(Boolean)
        .join(" ") || "",
    openingHours: tags.opening_hours || "",
    phone: tags.phone || tags["contact:phone"] || "",
    website: tags.website || tags["contact:website"] || "",
    lat: element.lat,
    lon: element.lon,
    source: "openstreetmap-overpass",
  };
}

async function fetchOverpassNightlife(lat, lon) {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"~"bar|pub|nightclub|music_venue"](around:12000,${lat},${lon});
    );
    out body;
  `;

  const { data } = await axios.post(OVERPASS_URL, query, {
    headers: { "Content-Type": "text/plain" },
    timeout: 20000,
  });

  const elements = Array.isArray(data?.elements) ? data.elements : [];
  return elements
    .filter((el) => typeof el.lat === "number" && typeof el.lon === "number")
    .map(normalizeOverpassElement);
}

// GET /api/maps/search?q=<city or bar name>
router.get("/search", async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length === 0) {
    return res.status(400).json({ error: "Query parameter q is required" });
  }
  try {
    const accessToken = await getAccessToken();
    const { data } = await axios.get("https://maps-api.apple.com/v1/geocode", {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { q: q.trim(), lang: "en-US" },
      timeout: 8000,
    });
    const results = (data.results || []).map((place) => ({
      id: place.coordinate ? `${place.coordinate.latitude},${place.coordinate.longitude}` : place.name,
      name: place.name,
      address: place.formattedAddressLines ? place.formattedAddressLines.join(", ") : place.name,
      coordinate: {
        latitude: place.coordinate.latitude,
        longitude: place.coordinate.longitude,
      },
    }));
    res.json({ results });
  } catch (err) {
    console.error("Geocode error:", err.response?.status, err.response?.data || err.message);
    res.status(500).json({ error: "Geocode failed" });
  }
});

// GET /api/maps/nightlife?q=<city>
router.get("/nightlife", async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ error: "Query parameter q is required" });
  }

  try {
    const accessToken = await getAccessToken();
    const { data: geoData } = await axios.get("https://maps-api.apple.com/v1/geocode", {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { q: q.trim(), lang: "en-US" },
      timeout: 8000,
    });

    const coordinate = geoData.results?.[0]?.coordinate;
    if (!coordinate) {
      return res.json({ source: "apple-maps", count: 0, bars: [] });
    }

    const terms = ["bars", "nightlife", "pub", "live music", "music venue"];
    const searchCalls = terms.map((term) =>
      axios.get("https://maps-api.apple.com/v1/search", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          q: term,
          searchLocation: `${coordinate.latitude},${coordinate.longitude}`,
          lang: "en-US",
          limit: 20,
        },
        timeout: 9000,
      })
    );

    const responses = await Promise.all(searchCalls);
    const merged = responses.flatMap((r) => r.data?.results || []).map(normalizeApplePlace);

    const deduped = [];
    const seen = new Set();
    for (const place of merged) {
      const key = place.barId || `${place.name}-${place.lat}-${place.lon}`;
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(place);
      }
    }

    return res.json({ source: "apple-maps", count: deduped.length, bars: deduped });
  } catch (appleErr) {
    try {
      const lat = toNumber(req.query.lat);
      const lon = toNumber(req.query.lon);

      if (lat !== null && lon !== null) {
        const fallbackBars = await fetchOverpassNightlife(lat, lon);
        return res.json({ source: "openstreetmap-overpass", count: fallbackBars.length, bars: fallbackBars });
      }

      const accessToken = await getAccessToken();
      const { data: geoData } = await axios.get("https://maps-api.apple.com/v1/geocode", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { q: q.trim(), lang: "en-US" },
        timeout: 8000,
      });
      const coordinate = geoData.results?.[0]?.coordinate;
      if (!coordinate) {
        return res.status(502).json({ error: "Nightlife search failed" });
      }
      const fallbackBars = await fetchOverpassNightlife(coordinate.latitude, coordinate.longitude);
      return res.json({ source: "openstreetmap-overpass", count: fallbackBars.length, bars: fallbackBars });
    } catch (fallbackErr) {
      console.error("Nightlife search error:", fallbackErr.response?.status, fallbackErr.response?.data || fallbackErr.message);
      return res.status(502).json({ error: "Nightlife search failed" });
    }
  }
});

module.exports = router;
