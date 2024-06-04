const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//adding this as a schema to get the auto created timestamp
const reviewSchema = new Schema({
    user: {
        type: String
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
        type: String
    }
}, { timestamps: true });

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
    reviews: [reviewSchema]
    // reviews: [{
    //     user: {
    //         type: String
    //     },
    //     room: {
    //         type: Number
    //     },
    //     location: {
    //         type: Number
    //     },
    //     bathroom: {
    //         type: Number
    //     },
    //     review: {
    //         type: String
    //     }
    // }]
}, { timestamps: true });

module.exports = mongoose.model('Ad', adSchema);