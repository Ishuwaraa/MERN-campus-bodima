const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    university: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    bed: {
        type: String,
        required: true 
    },
    bathroom: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true 
    },
    description: {
        type: String,
        required: true
    },
    images: [String],
    rating: {
        type: Number
    },
    status: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Ad', adSchema);