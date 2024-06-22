const express = require('express');
const router = express.Router();
const admins = require('../controllers/adminController');
const ads = require('../controllers/adController');
const { verifyJWT } = require('../middleware/authMiddleware');

//signup
router.post('/register', verifyJWT, admins.registerUser);

//login
router.post('/login', admins.loginUser);

//logout
router.get('/logout', admins.logoutUser);

//refresh access
router.get('/refresh', admins.refreshAccessToken);

//get admin data
router.get('/', verifyJWT, admins.getAdminData);

//udpate admin data
router.patch('/update', verifyJWT, admins.updateAdminData);

//update admin pass
router.patch('/update-pass', verifyJWT, admins.updateAdminPass);

//forgot password
router.post('/forgot-pass', admins.forgotPass);

//reset password
router.patch('/reset-pass/:token', admins.resetPass);

//delete admin acc
router.post('/del', verifyJWT, admins.deleteAdminAcc);

//get all users
router.get('/users', verifyJWT, admins.getAllUsers);

//get all ads
router.get('/all-ads', verifyJWT, admins.getAllAds);

//get ad details
router.get('/ad/:id', verifyJWT, ads.getAd);

//approve ad
router.patch('/update-ad/:id', verifyJWT, admins.updateAdStatus);

//update user data

//delete ad
router.post('/delete-ad/:id', verifyJWT, admins.deleteAd);

module.exports = router;