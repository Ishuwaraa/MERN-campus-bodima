const express = require('express');
const router = express.Router();
const feedback = require('../controllers/feedbackController');

//get feedbacks
router.get('/', feedback.getFeedbacks);

//add feedback 
router.post('/', feedback.addFeedback);

module.exports = router;