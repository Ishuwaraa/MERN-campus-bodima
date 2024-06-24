const Review = require('../models/reviewModel');
const Ad = require('../models/adModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

//get all reviews
const getReviews = async (req, res) => {
    try{
        const adId = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(adId)) return res.status(404).json({ msg: "Invalid ID. No such Ad was found" });

        const adExists = await Ad.findById(adId);
        if(!adExists) return res.status(404).json({ msg: "No such ad was found" });

        const reviewDoc = await Review.findById(adId).sort({ createdAt: -1 });

        const reviewsArray = reviewDoc? reviewDoc.reviews : [];
        const usernameArray = []

        for(const review of reviewsArray){
            if(review.anonUser){
                usernameArray.push('Anonymous user');
            }else {
                try{
                    const user = await User.findById(review.userId);
                    if(!user) {
                        usernameArray.push('Deleted user');
                    }else {
                        usernameArray.push(user.name);
                    }
                } catch (err) {
                    return res.status(500).json({ msg: 'Error fetching user names' });
                }
            }
        }
        // console.log('reviews', reviewDoc);
        // console.log('reviewsarray', reviewsArray);
        // console.log('usernames', usernameArray);

        res.status(200).json({ reviewsArray, usernameArray });
    }catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

//add review
const addReview = async (req, res) => {
    const userId = req.user;
    const adId = req.params.id;
    const { anonUser, roomRate, locationRate, bathroomRate, review } = req.body;

    try{
        if(!mongoose.Types.ObjectId.isValid(adId)) return res.status(404).json({ msg: "Invalid ID. No such Ad was found" });
        if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(404).json({ msg: "Invalid ID" });

        const adExists = await Ad.findById(adId);
        if(!adExists) return res.status(404).json({ msg: "No such ad was found" });

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({ msg: 'No user found' });

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
            anonUser,
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

        if(!updatedDoc) return res.status(500).json({ msg: "Unable to add review"})
        res.status(200).json(updatedDoc);
    }catch(err) {
        res.status(500).json({ msg: err.message })
    }
}

module.exports = { addReview, getReviews }