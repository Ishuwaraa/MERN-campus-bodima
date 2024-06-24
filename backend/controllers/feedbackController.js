const Feedback = require('../models/feedbackModel');

const addFeedback = async (req, res) => {
    const { rate, feedback } = req.body;

    try{
        const response = await Feedback.create({ rating: rate, feedback });
        if(!response) return res.status(500).json({ msg: 'Unable add your feedback' });

        res.status(201).json({ msg: 'Feedback added' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

const getFeedbacks = async (req, res) => {
    try{
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.status(200).json(feedbacks);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

module.exports = { addFeedback, getFeedbacks };