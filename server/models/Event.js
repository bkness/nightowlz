const mongoose = require("mongoose");

const EVENT_CATEGORIES = [
    "live-music",
    "karaoke",
    "trivia",
    "happy-hour",
    "dj",
    "other",
];

const eventSchema = new mongoose.Schema({
    barId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bar",
        required: true,
        index: true,
    },

    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },

    description: {
        type: String,
        trim: true,
        maxlength: 500,
    },

    category: {
        type: String,
        enum: EVENT_CATEGORIES,
        default: "other",
    },

    startsAt: {
        type: Date,
        required: true,
    },

    endsAt: {
        type: Date,
        default: null,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
module.exports.EVENT_CATEGORIES = EVENT_CATEGORIES;
