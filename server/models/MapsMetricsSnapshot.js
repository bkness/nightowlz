const mongoose = require("mongoose");

const latencyStatsSchema = new mongoose.Schema(
    {
        count: { type: Number, default: 0, min: 0 },
        median: { type: Number, default: null, min: 0 },
        p95: { type: Number, default: null, min: 0 },
    },
    { _id: false }
);

const mapsMetricsSnapshotSchema = new mongoose.Schema(
    {
        tokenRefreshCount: { type: Number, default: 0, min: 0 },
        apple429Count: { type: Number, default: 0, min: 0 },
        apple5xxCount: { type: Number, default: 0, min: 0 },
        fallbackToOverpassCount: { type: Number, default: 0, min: 0 },
        geocodeLatencyMs: { type: latencyStatsSchema, default: () => ({}) },
        nightlifeLatencyMs: { type: latencyStatsSchema, default: () => ({}) },
        cacheSize: { type: Number, default: 0, min: 0 },
        capturedAt: { type: Date, default: Date.now },
    },
    { versionKey: false }
);

mapsMetricsSnapshotSchema.index({ capturedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

module.exports = mongoose.model("MapsMetricsSnapshot", mapsMetricsSnapshotSchema);
