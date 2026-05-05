const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const MapsMetricsSnapshot = require("../../models/MapsMetricsSnapshot");

let cachedAccessToken = null;
let tokenExpiresAt = 0;
let tokenRequestPromise = null;
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const SEARCH_CACHE_TTL_MS = 10 * 60 * 1000;
const LATENCY_SAMPLE_LIMIT = 200;
const METRICS_PERSIST_INTERVAL_MS = Number(process.env.MAPS_METRICS_PERSIST_INTERVAL_MS || 60_000);
const nightlifeSearchCache = new Map();
const mapsMetrics = {
    tokenRefreshCount: 0,
    apple429Count: 0,
    apple5xxCount: 0,
    fallbackToOverpassCount: 0,
    nightlifeLatencyMs: [],
    geocodeLatencyMs: [],
};

const SEARCH_MODE_TERMS = {
    bars: [
        "bar",
        "pub",
        "cocktail bar",
        "sports bar",
        "dive bar",
        "wine bar",
        "brewery",
        "taproom",
    ],
    clubs: [
        "night club",
        "nightclub",
        "dance club",
        "lounge",
        "dj",
    ],
    live_music: [
        "live music",
        "live music venue",
        "music venue",
        "concert hall",
        "amphitheater",
        "jazz club",
        "rock club",
        "dueling piano bar",
    ],
    entertainment: [
        "karaoke bar",
        "arcade bar",
        "comedy club",
        "pool hall",
        "bowling alley",
        "billiards",
        "dueling piano bar",
    ],
};

function normalizeCategoryKey(rawCategory = "") {
    return String(rawCategory)
        .trim()
        .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
        .toLowerCase()
        .replace(/[\s-]+/g, "_")
        .replace(/[^a-z0-9_]/g, "")
        .replace(/_+/g, "_");
}

function pickFirstString(...values) {
    for (const value of values) {
        if (typeof value === "string" && value.trim()) {
            return value.trim();
        }
    }
    return "";
}

function normalizeAddressLines(lines = []) {
    const source = Array.isArray(lines) ? lines : [lines];
    return source
        .flatMap((line) => String(line || "").split("\n"))
        .map((line) => line.trim())
        .filter(Boolean);
}

function extractAppleOpeningHours(place) {
    const direct = pickFirstString(place.openingHours, place.openingHoursText, place.businessHoursText);
    if (direct) return direct;

    const candidates = [place.openingHours, place.businessHours, place.operatingHours, place.regularHours];
    for (const candidate of candidates) {
        if (!candidate) continue;
        if (Array.isArray(candidate)) {
            const joined = candidate.filter((item) => typeof item === "string" && item.trim()).join(" | ");
            if (joined) return joined;
            continue;
        }
        if (Array.isArray(candidate.displayLines)) {
            const joined = candidate.displayLines.filter((item) => typeof item === "string" && item.trim()).join(" | ");
            if (joined) return joined;
        }
        if (Array.isArray(candidate.days)) {
            const joined = candidate.days.filter((item) => typeof item === "string" && item.trim()).join(" | ");
            if (joined) return joined;
        }
    }

    return "";
}

function extractApplePhone(place) {
    return pickFirstString(
        place.phone,
        place.phoneNumber,
        place.displayPhoneNumber,
        place.contact?.phone,
        place.contact?.phoneNumber,
    );
}

function extractAppleWebsite(place) {
    return pickFirstString(
        place.website,
        place.websiteUrl,
        place.url,
        place.displayUrl,
    );
}

function needsAppleDetails(place) {
    return !extractApplePhone(place) || !extractAppleWebsite(place) || !extractAppleOpeningHours(place);
}

function pickApplePlaceDetailsPayload(data, placeId) {
    if (!data) return null;

    if (Array.isArray(data.results) && data.results.length > 0) {
        const exact = data.results.find((item) => item?.id === placeId);
        return exact || data.results[0];
    }

    if (data.result && typeof data.result === "object") {
        return data.result;
    }

    if (typeof data === "object") {
        return data;
    }

    return null;
}

async function enrichApplePlaces(accessToken, places) {
    const maxDetails = Math.max(0, Math.min(Number(process.env.APPLE_MAPS_DETAILS_MAX || 8), 20));
    const enriched = [...places];
    let detailsRequests = 0;

    for (let index = 0; index < enriched.length; index += 1) {
        const place = enriched[index];
        if (!place?.id || !needsAppleDetails(place)) continue;
        if (detailsRequests >= maxDetails) break;

        detailsRequests += 1;

        try {
            const { data } = await appleMapsGet(
                accessToken,
                "https://maps-api.apple.com/v1/place",
                { id: place.id, lang: "en-US" },
                7000,
            );

            const details = pickApplePlaceDetailsPayload(data, place.id);
            if (details && typeof details === "object") {
                enriched[index] = { ...place, ...details };
            }
        } catch {
            // Keep the base search result when details lookup is unavailable.
        }
    }

    return enriched;
}

const CATEGORY_DISPLAY_LABELS = {
    bars: "Bar",
    clubs: "Club / Lounge",
    live_music: "Live Music",
    entertainment: "Entertainment",
};

function mapPlaceCategory(rawCategory = "") {
    const category = normalizeCategoryKey(rawCategory);

    if (["bar", "pub", "brewery", "taproom", "wine_bar", "cocktail_bar"].includes(category)) {
        return "bars";
    }

    if (["nightclub", "night_club", "nightlife", "dance_club", "lounge", "dj"].includes(category)) {
        return "clubs";
    }

    if (["music_venue", "musicvenue", "concert_hall", "amphitheater", "jazz_club", "live_music_venue", "rock_club", "live_music"].includes(category)) {
        return "live_music";
    }

    if (["karaoke", "karaoke_bar", "arcade", "arcade_bar", "comedy_club", "bowling_alley", "pool_hall", "billiards", "dueling_piano_bar", "entertainment_venue"].includes(category)) {
        return "entertainment";
    }

    return null;
}

function pushLatencySample(samples, value) {
    if (!Number.isFinite(value) || value < 0) return;
    samples.push(Math.round(value));
    if (samples.length > LATENCY_SAMPLE_LIMIT) {
        samples.splice(0, samples.length - LATENCY_SAMPLE_LIMIT);
    }
}

function summarizeLatency(samples) {
    if (!samples.length) {
        return { count: 0, median: null, p95: null };
    }

    const sorted = [...samples].sort((a, b) => a - b);
    const medianIndex = Math.floor((sorted.length - 1) * 0.5);
    const p95Index = Math.floor((sorted.length - 1) * 0.95);
    return {
        count: sorted.length,
        median: sorted[medianIndex],
        p95: sorted[p95Index],
    };
}

function getMetricsSnapshot() {
    return {
        tokenRefreshCount: mapsMetrics.tokenRefreshCount,
        apple429Count: mapsMetrics.apple429Count,
        apple5xxCount: mapsMetrics.apple5xxCount,
        fallbackToOverpassCount: mapsMetrics.fallbackToOverpassCount,
        geocodeLatencyMs: summarizeLatency(mapsMetrics.geocodeLatencyMs),
        nightlifeLatencyMs: summarizeLatency(mapsMetrics.nightlifeLatencyMs),
        cacheSize: nightlifeSearchCache.size,
    };
}

function logMapsEvent(event, details = {}) {
    console.log(
        JSON.stringify({
            scope: "maps-api",
            event,
            ts: new Date().toISOString(),
            ...details,
        })
    );
}

let metricsPersistInFlight = false;

async function persistMetricsSnapshot() {
    if (metricsPersistInFlight) return;
    if (mongoose.connection.readyState !== 1) return;

    metricsPersistInFlight = true;
    try {
        const snapshot = getMetricsSnapshot();
        await MapsMetricsSnapshot.create({
            ...snapshot,
            capturedAt: new Date(),
        });
        logMapsEvent("metrics.snapshot.persisted", {
            tokenRefreshCount: snapshot.tokenRefreshCount,
            apple429Count: snapshot.apple429Count,
            apple5xxCount: snapshot.apple5xxCount,
            fallbackToOverpassCount: snapshot.fallbackToOverpassCount,
            cacheSize: snapshot.cacheSize,
        });
    } catch (err) {
        logMapsEvent("metrics.snapshot.error", {
            message: err.message,
        });
    } finally {
        metricsPersistInFlight = false;
    }
}

const metricsPersistTimer = setInterval(persistMetricsSnapshot, METRICS_PERSIST_INTERVAL_MS);
if (typeof metricsPersistTimer.unref === "function") {
    metricsPersistTimer.unref();
}

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
    const requestedModes = String(value || "bars,clubs,live_music,entertainment")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    const validModes = requestedModes.filter((mode) => SEARCH_MODE_TERMS[mode]);
    return validModes.length > 0 ? validModes : ["bars", "clubs", "live_music", "entertainment"];
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
        return null;
    }
    return cached.payload;
}

function readStaleNightlifeResult(cacheKey) {
    return nightlifeSearchCache.get(cacheKey)?.payload || null;
}

function writeCachedNightlifeResult(cacheKey, payload) {
    nightlifeSearchCache.set(cacheKey, {
        payload,
        expiresAt: Date.now() + SEARCH_CACHE_TTL_MS,
    });
}

function getAppleMapsConfig() {
    const { APPLE_MAPS_PRIVATE_KEY, APPLE_MAPS_PRIVATE_KEY_PATH, APPLE_MAPS_TEAM_ID, APPLE_MAPS_KEY_ID } = process.env;
    if (!APPLE_MAPS_TEAM_ID || !APPLE_MAPS_KEY_ID) {
        throw new Error("Apple Maps env is incomplete (APPLE_MAPS_TEAM_ID, APPLE_MAPS_KEY_ID required)");
    }
    if (!APPLE_MAPS_PRIVATE_KEY && !APPLE_MAPS_PRIVATE_KEY_PATH) {
        throw new Error("Apple Maps env is incomplete (APPLE_MAPS_PRIVATE_KEY or APPLE_MAPS_PRIVATE_KEY_PATH required)");
    }

    if (APPLE_MAPS_PRIVATE_KEY) {
        return { key: APPLE_MAPS_PRIVATE_KEY.replace(/\\n/g, "\n"), teamId: APPLE_MAPS_TEAM_ID, keyId: APPLE_MAPS_KEY_ID };
    }

    const resolvedKeyPath = path.resolve(APPLE_MAPS_PRIVATE_KEY_PATH);
    if (!fs.existsSync(resolvedKeyPath)) {
        throw new Error(`Apple Maps private key file not found at ${resolvedKeyPath}`);
    }

    return { keyPath: resolvedKeyPath, teamId: APPLE_MAPS_TEAM_ID, keyId: APPLE_MAPS_KEY_ID };
}

async function appleMapsGet(accessToken, endpoint, params, timeout = 9000) {
    try {
        return await axios.get(endpoint, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params,
            timeout,
        });
    } catch (err) {
        const status = err.response?.status;
        if (status === 429) mapsMetrics.apple429Count += 1;
        if (typeof status === "number" && status >= 500) mapsMetrics.apple5xxCount += 1;

        const isRetryable = !status || status === 429 || status >= 500;
        if (!isRetryable) throw err;

        logMapsEvent("apple.request.retry", {
            endpoint,
            status: status || "network",
        });

        return axios.get(endpoint, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params,
            timeout,
        });
    }
}

async function getAccessToken() {
    const now = Math.floor(Date.now() / 1000);
    if (cachedAccessToken && now < tokenExpiresAt - 60) return cachedAccessToken;

    if (tokenRequestPromise) return tokenRequestPromise;

    tokenRequestPromise = (async () => {
        const config = getAppleMapsConfig();
        const key = config.key || fs.readFileSync(config.keyPath);
        const mapsAuthToken = jwt.sign(
            { iss: config.teamId, iat: now, exp: now + 1800 },
            key,
            { algorithm: "ES256", keyid: config.keyId }
        );

        const { data } = await axios.get("https://maps-api.apple.com/v1/token", {
            headers: { Authorization: `Bearer ${mapsAuthToken}` },
            timeout: 8000,
        });

        mapsMetrics.tokenRefreshCount += 1;
        logMapsEvent("token.refreshed", { expiresInSeconds: data.expiresInSeconds });
        cachedAccessToken = data.accessToken;
        tokenExpiresAt = now + data.expiresInSeconds;
        return cachedAccessToken;
    })();

    try {
        return await tokenRequestPromise;
    } finally {
        tokenRequestPromise = null;
    }
}

function normalizeApplePlace(place, originCoordinate) {
    const latitude = place.coordinate?.latitude;
    const longitude = place.coordinate?.longitude;
    const distanceMeters = getDistanceMeters(originCoordinate, place.coordinate);
    const addressLines = normalizeAddressLines(place.formattedAddressLines || []);
    const rawCategory = place.poiCategory || "";

    const mappedCategory = mapPlaceCategory(rawCategory);

    return {
        barId: place.id || `${latitude},${longitude}`,
        name: place.name || "Unknown",
        category: mappedCategory || "bars",
        vibe: CATEGORY_DISPLAY_LABELS[mappedCategory] || rawCategory,
        neighborhood: addressLines.join(", "),
        addressLines,
        locality: place.structuredAddress?.locality || "",
        state: place.structuredAddress?.administrativeAreaCode || place.structuredAddress?.administrativeArea || "",
        openingHours: extractAppleOpeningHours(place),
        phone: extractApplePhone(place),
        website: extractAppleWebsite(place),
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
    const rawCategory = tags.amenity || tags.tourism || tags.leisure || tags.club || "bar";

    return {
        barId: String(element.id),
        name: tags.name || "Unnamed Bar",
        category: mapPlaceCategory(rawCategory),
        vibe: rawCategory,
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
    mapsMetrics.fallbackToOverpassCount += 1;

    const amenityTerms = [];
    const tourismTerms = [];
    const leisureTerms = [];
    const clubTerms = [];
    if (modes.includes("bars")) {
        amenityTerms.push("bar", "pub");
    }
    if (modes.includes("clubs")) {
        amenityTerms.push("nightclub", "night_club", "dance_club", "danceclub", "dj");
    }
    if (modes.includes("live_music")) {
        amenityTerms.push("music_venue", "bar", "pub", "live_music_venue", "performance_space");
        tourismTerms.push("music_venue", "amphitheater", "concert_hall", "live_music_venue", "performance_space");
    }
    if (modes.includes("entertainment")) {
        amenityTerms.push("karaoke_bar", "bar", "pub", "bowling_alley");
        leisureTerms.push("karaoke_bar", "amusement_arcade", "adult_gaming_center", "bowling_alley", "entertainment_venue");
    }
    const queryParts = []
    const uniqueAmenityTerms = [...new Set(amenityTerms)];
    const uniqueTourismTerms = [...new Set(tourismTerms)];
    const uniqueLeisureTerms = [...new Set(leisureTerms)];
    const uniqueClubTerms = [...new Set(clubTerms)];
    if (uniqueAmenityTerms.length) {
        queryParts.push(`node["amenity"~"${uniqueAmenityTerms.join("|")}"](around:12000,${lat},${lon});`);

    }
    if (uniqueTourismTerms.length) {
        queryParts.push(`node["tourism"~"${uniqueTourismTerms.join("|")}"](around:12000,${lat},${lon});`);
    }
    if (uniqueLeisureTerms.length) {
        queryParts.push(`node["leisure"~"${uniqueLeisureTerms.join("|")}"](around:12000,${lat},${lon});`);
    }
    if (uniqueClubTerms.length) {
        queryParts.push(`node["club"~"${uniqueClubTerms.join("|")}"](around:12000,${lat},${lon});`);
    }
    const query = `
    [out:json][timeout:25];
    (
        ${queryParts.join("\n")}
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
    const startedAt = Date.now();
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
        return res.status(400).json({ error: "Query parameter q is required" });
    }

    const sendSearchResponse = (status, payload, source = "apple-maps") => {
        const durationMs = Date.now() - startedAt;
        pushLatencySample(mapsMetrics.geocodeLatencyMs, durationMs);
        const latency = summarizeLatency(mapsMetrics.geocodeLatencyMs);
        logMapsEvent("search.request", {
            status,
            source,
            queryLength: q.trim().length,
            resultCount: Array.isArray(payload?.results) ? payload.results.length : 0,
            durationMs,
            medianMs: latency.median,
            p95Ms: latency.p95,
        });
        return res.status(status).json(payload);
    };

    try {
        const accessToken = await getAccessToken();
        const { data } = await appleMapsGet(accessToken, "https://maps-api.apple.com/v1/geocode", { q: q.trim(), lang: "en-US" }, 8000);
        const results = (data.results || []).map((place) => ({
            id: place.coordinate ? `${place.coordinate.latitude},${place.coordinate.longitude}` : place.name,
            name: place.name,
            address: place.formattedAddressLines ? place.formattedAddressLines.join(", ") : place.name,
            coordinate: {
                latitude: place.coordinate.latitude,
                longitude: place.coordinate.longitude,
            },
        }));
        return sendSearchResponse(200, { results });
    } catch (err) {
        console.error("Geocode error:", err.response?.status, err.response?.data || err.message);
        return sendSearchResponse(500, { error: "Geocode failed" }, "error");
    }
});

// GET /api/maps/places?q=<city>
router.get("/places", async (req, res) => {
    const startedAt = Date.now();
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
        return res.status(400).json({ error: "Query parameter q is required" });
    }

    const modes = parseSearchModes(req.query.modes);

    const sendNightlifeResponse = (status, payload, cacheMode = "miss") => {
        const durationMs = Date.now() - startedAt;
        pushLatencySample(mapsMetrics.nightlifeLatencyMs, durationMs);
        const latency = summarizeLatency(mapsMetrics.nightlifeLatencyMs);
        logMapsEvent("nightlife.request", {
            status,
            source: payload?.source || "none",
            cache: cacheMode,
            queryLength: q.trim().length,
            modes,
            barsCount: Array.isArray(payload?.bars) ? payload.bars.length : 0,
            durationMs,
            medianMs: latency.median,
            p95Ms: latency.p95,
        });

        return res.status(status).json(payload);
    };

    const cacheKey = getNightlifeCacheKey(q, modes);
    const cachedResult = readCachedNightlifeResult(cacheKey);
    if (cachedResult) {
        return sendNightlifeResponse(200, cachedResult, "hit");
    }

    try {
        const accessToken = await getAccessToken();
        const { data: geoData } = await appleMapsGet(accessToken, "https://maps-api.apple.com/v1/geocode", { q: q.trim(), lang: "en-US" }, 8000);

        const geoResult = geoData.results?.[0];
        const coordinate = geoResult?.coordinate;
        const searchRegion = buildSearchRegion(geoResult?.displayMapRegion);
        if (!coordinate) {
            return sendNightlifeResponse(200, { source: "apple-maps", count: 0, bars: [], modes });
        }

        const terms = getSearchTerms(modes);
        const searchCalls = terms.map((term) =>
            appleMapsGet(
                accessToken,
                "https://maps-api.apple.com/v1/search",
                {
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
                9000
            )
        );

        const responses = await Promise.all(searchCalls);
        const rawPlaces = responses
            .flatMap((response) => response.data?.results || []);
        const enrichedPlaces = await enrichApplePlaces(accessToken, rawPlaces);
        const merged = enrichedPlaces
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

        const modeFiltered = deduped.filter((place) => modes.includes(place.category));
        const localResults = filterToLocalResults(modeFiltered.length > 0 ? modeFiltered : deduped, coordinate, geoResult?.displayMapRegion);
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
            return sendNightlifeResponse(200, payload);
        }

        const payload = {
            source: "apple-maps",
            count: finalizedResults.length,
            modes,
            center: coordinate,
            bars: finalizedResults,
        };
        writeCachedNightlifeResult(cacheKey, payload);
        return sendNightlifeResponse(200, payload);
    } catch (appleErr) {
        try {
            const lat = toNumber(req.query.lat);
            const lon = toNumber(req.query.lon);

            if (lat !== null && lon !== null) {
                const fallbackBars = await fetchOverpassNightlife(lat, lon, modes);
                const payload = { source: "openstreetmap-overpass", count: fallbackBars.length, modes, center: { latitude: lat, longitude: lon }, bars: fallbackBars };
                writeCachedNightlifeResult(cacheKey, payload);
                return sendNightlifeResponse(200, payload);
            }

            const accessToken = await getAccessToken();
            const { data: geoData } = await appleMapsGet(accessToken, "https://maps-api.apple.com/v1/geocode", { q: q.trim(), lang: "en-US" }, 8000);
            const coordinate = geoData.results?.[0]?.coordinate;
            if (!coordinate) {
                return sendNightlifeResponse(502, { error: "Nightlife search failed" });
            }
            const fallbackBars = await fetchOverpassNightlife(coordinate.latitude, coordinate.longitude, modes);
            const payload = { source: "openstreetmap-overpass", count: fallbackBars.length, modes, center: coordinate, bars: fallbackBars };
            writeCachedNightlifeResult(cacheKey, payload);
            return sendNightlifeResponse(200, payload);
        } catch (fallbackErr) {
            console.error("Nightlife search error:", fallbackErr.response?.status, fallbackErr.response?.data || fallbackErr.message);
            const staleResult = readStaleNightlifeResult(cacheKey);
            if (staleResult) {
                return sendNightlifeResponse(200, staleResult, "stale");
            }
            return sendNightlifeResponse(502, { error: "Nightlife search failed" });
        }
    }
});

// GET /api/maps/metrics
router.get("/metrics", (_req, res) => {
    res.json(getMetricsSnapshot());
});

module.exports = router;
