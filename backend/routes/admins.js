const express = require('express');
const router = express.Router();
const admins = require('../controllers/adminController');
const ads = require('../controllers/adController');
const { verifyJWT } = require('../middleware/authMiddleware');

//signup
router.post('/register', admins.registerUser);

//login
router.post('/login', admins.loginUser);

//logout
router.get('/logout', admins.logoutUser);

//refresh access
router.get('/refresh', admins.refreshAccessToken);

//udpate data

//update pass

//delete acc

//get all users

//get all ads
router.get('/all-ads', verifyJWT, admins.getAllAds);

//get ad details
router.get('/ad/:id', verifyJWT, ads.getAd);

//update/aprove/delete ad
router.patch('/update-ad/:id', verifyJWT, admins.updateAdStatus);

//update user data

module.exports = router;