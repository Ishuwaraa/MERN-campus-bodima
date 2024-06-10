const express = require('express');
const router = express.Router();
const review = require('../controllers/reviewController');

//get all reviews
router.get('/:id', review.getReviews);

//add review
router.post('/:id', review.addReview);

module.exports = router;