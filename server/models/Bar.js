const mongoose = require('mongoose');

const barSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },

    location: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120,
    },

    description: {
        type: String,
        trim: true,
        maxlength: 500,
    },

    phone: {
        type: String,
        trim: true,
        maxlength: 20,
    },

    website: {
        type: String,
        trim: true,
        maxlength: 100,
    },

    openingHours: {
        type: String,
        trim: true,
        maxlength: 50,
    },

    coordinates: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null },
    },

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });


module.exports = mongoose.model('Bar', barSchema);
