const mongoose = require("mongoose");

const savedBarSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        barId: { type: String, required: true },
        name: { type: String, required: true },
        vibe: { type: String, default: "" },
        neighborhood: { type: String, default: "" },
        category: { type: String, default: "" },
        openingHours: { type: String, default: "" },
        lat: { type: Number, default: null },
        lon: { type: Number, default: null },
        source: { type: String, default: "openstreetmap-overpass" },
    },
    { timestamps: true }
);

savedBarSchema.index({ userId: 1, barId: 1 }, { unique: true });

module.exports = mongoose.model("SavedBar", savedBarSchema);
