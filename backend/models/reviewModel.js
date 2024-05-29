const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
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

module.exports = mongoose.model('Review', reviewSchema);