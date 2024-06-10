const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviews = new Schema({
    userId: {
        type: String,
        required: true
    },
    room: {
        type: Number
    },
    location: {
        type: Number
    },
    bathroom: {
        type: Number
    },
    review: {
        type: String,
        required: true
    }
}, { timestamps: true });

const reviewSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    reviews: [reviews]
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);