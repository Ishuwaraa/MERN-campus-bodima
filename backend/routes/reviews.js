const express = require('express');
const router = express.Router();
const review = require('../controllers/reviewController');
const { verifyJWT } = require('../middleware/authMiddleware');

//get all reviews
router.get('/:id', review.getReviews);

//add review
router.post('/:id', verifyJWT, review.addReview);

module.exports = router;