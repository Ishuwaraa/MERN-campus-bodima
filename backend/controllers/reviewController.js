const Review = require('../models/reviewModel');
const Ad = require('../models/adModel');
const mongoose = require('mongoose');

//get all reviews
const getReviews = async (req, res) => {
    try{
        const adId = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(adId)) return res.status(404).json({ msg: "Invalid ID. No such Ad was found" });

        const adExists = await Ad.findById(adId);
        if(!adExists) return res.status(404).json({ msg: "No such ad was found" });

        const reviews = await Review.findById(adId).sort({ createdAt: -1 });

        const reviewsArray = reviews? reviews.reviews : [];

        res.status(200).json(reviewsArray);
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//add review
const addReview = async (req, res) => {
    try{
        const adId = req.params.id;
        const { userId, roomRate, locationRate, bathroomRate, review } = req.body;

        if(!mongoose.Types.ObjectId.isValid(adId)) return res.status(404).json({ msg: "Invalid ID. No such Ad was found" });

        const adExists = await Ad.findById(adId);
        if(!adExists) return res.status(404).json({ msg: "No such ad was found" });

        let reviewDoc = await Review.findById(adId);

        //if no doc was found create one
        if(!reviewDoc) {
            reviewDoc = new Review({
                _id: adId,
                reviews: []
            });
        }

        //pushing to the doc
        reviewDoc.reviews.push({
            userId: userId,
            room: roomRate,
            location: locationRate,
            bathroom: bathroomRate,
            review: review
        })

        const updatedDoc = await reviewDoc.save();

        const allReviews = await Review.findById(adId);
        if(allReviews.reviews.length > 0) {
            const reviewRatings = allReviews.reviews;
            let wholeRate = 0;

            reviewRatings.forEach((rate) => {
                const individualRate = rate.bathroom + rate.location + rate.room;
                wholeRate += individualRate;
            })
            const finalRate = wholeRate / (reviewRatings.length * 3);
            // console.log(finalRate.toFixed(1));

            await Ad.findByIdAndUpdate(adId, {
                rating: finalRate.toFixed(1)
            })
        }

        if(!updatedDoc) return res.status(404).json({ msg: "Unable to add review"})
        res.status(200).json(updatedDoc);
    }catch(err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = { addReview, getReviews }