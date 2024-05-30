const mongoose = require('mongoose');
const Review = require('../models/reviewModel');

//get all reviews
const getReviews = async (req, res) => {
    try{
        const reviews = await Review.find({}).sort({ createdAt: -1 });
        res.status(200).json(reviews);
    }catch(err) {
        res.status(500).json({ error: err.message });
    }
}

//add review
const addReview = async (req, res) => {
    try{
        const { roomRate, locationRate, bathroomRate, review } = req.body;
        const data = await Review.create({
            room: roomRate,
            location: locationRate,
            bathroom: bathroomRate,
            review
        });
        res.status(201).json(data);
    }catch(err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = { getReviews, addReview };