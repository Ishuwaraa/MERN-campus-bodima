const express = require('express');
const router = express.Router();
const reviews = require('../controllers/reviewController');

//get all reviews
router.get('/', reviews.getReviews);

//add review
router.post('/', reviews.addReview);