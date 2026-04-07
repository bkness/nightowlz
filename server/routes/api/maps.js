const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

let cachedAccessToken = null;
let tokenExpiresAt = 0;
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const SEARCH_CACHE_TTL_MS = 10 * 60 * 1000;
const nightlifeSearchCache = new Map();
const SEARCH_MODE_TERMS = {
    bars: ["bar"],
    nightlife: ["nightlife"],
};

function toNumber(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function toRadians(value) {
    return (value * Math.PI) / 180;
}

function getDistanceMeters(origin, target) {
    if (!origin || !target) return null;

    const earthRadius = 6371000;
    const dLat = toRadians(target.latitude - origin.latitude);
    const dLon = toRadians(target.longitude - origin.longitude);
    const lat1 = toRadians(origin.latitude);
    const lat2 = toRadians(target.latitude);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(earthRadius * c);
}

function parseSearchModes(value) {
    const requestedModes = String(value || "bars,nightlife")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

    const validModes = requestedModes.filter((mode) => SEARCH_MODE_TERMS[mode]);
    return validModes.length > 0 ? validModes : ["bars", "nightlife"];
}

function getSearchTerms(modes) {
    return [...new Set(modes.flatMap((mode) => SEARCH_MODE_TERMS[mode] || []))];
}

function buildSearchRegion(region) {
    if (!region) return null;

    const north = region.northLatitude;
    const east = region.eastLongitude;
    const south = region.southLatitude;
    const west = region.westLongitude;

    if ([north, east, south, west].some((value) => typeof value !== "number")) {
        return null;
    }

    return `${north},${east},${south},${west}`;
}

function getRegionRadiusMeters(region) {
    if (!region) return 25000;

    const center = {
        latitude: (region.northLatitude + region.southLatitude) / 2,
        longitude: (region.eastLongitude + region.westLongitude) / 2,
    };

    const edge = {
        latitude: region.northLatitude,
        longitude: region.eastLongitude,
    };

    return Math.max(5000, getDistanceMeters(center, edge));
}

function filterToLocalResults(places, center, region) {
    const maxDistance = getRegionRadiusMeters(region) * 1.5;
    return places.filter((place) => typeof place.distanceMeters === "number" && place.distanceMeters <= maxDistance);
}

function getNightlifeCacheKey(query, modes) {
    return `${query.trim().toLowerCase()}::${modes.slice().sort().join(",")}`;
}

function readCachedNightlifeResult(cacheKey) {
    const cached = nightlifeSearchCache.get(cacheKey);
    if (!cached) return null;
    if (Date.now() > cached.expiresAt) {
        nightlifeSearchCache.delete(cacheKey);
        return null;
    }
    return cached.payload;
}

function writeCachedNightlifeResult(cacheKey, payload) {
    nightlifeSearchCache.set(cacheKey, {
        payload,
        expiresAt: Date.now() + SEARCH_CACHE_TTL_MS,
    });
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

function normalizeApplePlace(place, originCoordinate) {
    const latitude = place.coordinate?.latitude;
    const longitude = place.coordinate?.longitude;
    const distanceMeters = getDistanceMeters(originCoordinate, place.coordinate);
    const addressLines = place.formattedAddressLines || [];

    return {
        barId: place.id || `${latitude},${longitude}`,
        name: place.name || "Unknown",
        category: place.poiCategory || "nightlife",
        vibe: place.poiCategory || "",
        neighborhood: addressLines.join(", "),
        addressLines,
        locality: place.structuredAddress?.locality || "",
        state: place.structuredAddress?.administrativeAreaCode || place.structuredAddress?.administrativeArea || "",
        openingHours: "",
        phone: place.phone || "",
        website: place.website || "",
        lat: latitude,
        lon: longitude,
        distanceMeters,
        source: "apple-maps",
    };
}

function normalizeOverpassElement(element, originCoordinate) {
    const tags = element.tags || {};
    const distanceMeters = getDistanceMeters(originCoordinate, {
        latitude: element.lat,
        longitude: element.lon,
    });

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
        addressLines: [],
        locality: tags["addr:city"] || "",
        state: tags["addr:state"] || "",
        openingHours: tags.opening_hours || "",
        phone: tags.phone || tags["contact:phone"] || "",
        website: tags.website || tags["contact:website"] || "",
        lat: element.lat,
        lon: element.lon,
        distanceMeters,
        source: "openstreetmap-overpass",
    };
}

async function fetchOverpassNightlife(lat, lon, modes) {
    const amenityTerms = [];
    if (modes.includes("bars")) amenityTerms.push("bar", "pub");
    if (modes.includes("nightlife")) amenityTerms.push("nightclub");

    const amenityPattern = [...new Set(amenityTerms)].join("|") || "bar|pub|nightclub|music_venue";
    const query = `
    [out:json][timeout:25];
    (
            node["amenity"~"${amenityPattern}"](around:12000,${lat},${lon});
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
        .map((element) =>
            normalizeOverpassElement(element, { latitude: lat, longitude: lon })
        )
        .sort((left, right) => (left.distanceMeters || Number.MAX_SAFE_INTEGER) - (right.distanceMeters || Number.MAX_SAFE_INTEGER));
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

    const modes = parseSearchModes(req.query.modes);
    const cacheKey = getNightlifeCacheKey(q, modes);
    const cachedResult = readCachedNightlifeResult(cacheKey);
    if (cachedResult) {
        return res.json(cachedResult);
    }

    try {
        const accessToken = await getAccessToken();
        const { data: geoData } = await axios.get("https://maps-api.apple.com/v1/geocode", {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { q: q.trim(), lang: "en-US" },
            timeout: 8000,
        });

        const geoResult = geoData.results?.[0];
        const coordinate = geoResult?.coordinate;
        const searchRegion = buildSearchRegion(geoResult?.displayMapRegion);
        if (!coordinate) {
            return res.json({ source: "apple-maps", count: 0, bars: [], modes });
        }

        const terms = getSearchTerms(modes);
        const searchCalls = terms.map((term) =>
            axios.get("https://maps-api.apple.com/v1/search", {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: {
                    q: searchRegion ? term : `${term} in ${q.trim()}`,
                    ...(searchRegion
                        ? { searchRegion, searchRegionPriority: "required" }
                        : {
                            searchLocation: `${coordinate.latitude},${coordinate.longitude}`,
                            userLocation: `${coordinate.latitude},${coordinate.longitude}`,
                        }),
                    lang: "en-US",
                    limit: 20,
                    resultTypeFilter: "Poi",
                },
                timeout: 9000,
            })
        );

        const responses = await Promise.all(searchCalls);
        const merged = responses
            .flatMap((response) => response.data?.results || [])
            .map((place) => normalizeApplePlace(place, coordinate));

        const deduped = [];
        const seen = new Set();
        for (const place of merged) {
            const key = place.barId || `${place.name}-${place.lat}-${place.lon}`;
            if (!seen.has(key)) {
                seen.add(key);
                deduped.push(place);
            }
        }

        const localResults = filterToLocalResults(deduped, coordinate, geoResult?.displayMapRegion);
        const finalizedResults = localResults.length > 0 ? localResults : deduped;

        finalizedResults.sort((left, right) => {
            const leftDistance = left.distanceMeters ?? Number.MAX_SAFE_INTEGER;
            const rightDistance = right.distanceMeters ?? Number.MAX_SAFE_INTEGER;
            if (leftDistance !== rightDistance) return leftDistance - rightDistance;
            return left.name.localeCompare(right.name);
        });

        if (finalizedResults.length === 0) {
            const fallbackBars = await fetchOverpassNightlife(coordinate.latitude, coordinate.longitude, modes);
            const payload = {
                source: "openstreetmap-overpass",
                count: fallbackBars.length,
                modes,
                center: coordinate,
                bars: fallbackBars,
            };
            writeCachedNightlifeResult(cacheKey, payload);
            return res.json(payload);
        }

        const payload = {
            source: "apple-maps",
            count: finalizedResults.length,
            modes,
            center: coordinate,
            bars: finalizedResults,
        };
        writeCachedNightlifeResult(cacheKey, payload);
        return res.json(payload);
    } catch (appleErr) {
        try {
            const lat = toNumber(req.query.lat);
            const lon = toNumber(req.query.lon);

            if (lat !== null && lon !== null) {
                const fallbackBars = await fetchOverpassNightlife(lat, lon, modes);
                const payload = { source: "openstreetmap-overpass", count: fallbackBars.length, modes, center: { latitude: lat, longitude: lon }, bars: fallbackBars };
                writeCachedNightlifeResult(cacheKey, payload);
                return res.json(payload);
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
            const fallbackBars = await fetchOverpassNightlife(coordinate.latitude, coordinate.longitude, modes);
            const payload = { source: "openstreetmap-overpass", count: fallbackBars.length, modes, center: coordinate, bars: fallbackBars };
            writeCachedNightlifeResult(cacheKey, payload);
            return res.json(payload);
        } catch (fallbackErr) {
            console.error("Nightlife search error:", fallbackErr.response?.status, fallbackErr.response?.data || fallbackErr.message);
            const staleResult = readCachedNightlifeResult(cacheKey);
            if (staleResult) {
                return res.json(staleResult);
            }
            return res.status(502).json({ error: "Nightlife search failed" });
        }
    }
});

module.exports = router;
