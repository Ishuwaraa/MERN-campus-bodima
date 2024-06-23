const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    rating: {
        type: Number
    },
    feedback: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);