const express = require('express');
const router = express.Router();
const users = require('../controllers/userController');
const { verifyJWT } = require('../middleware/authMiddleware');

//register user
router.post('/register', users.registerUser);

//login user
router.post('/login', users.loginUser);

//logout
router.get('/logout', users.logoutUser);

//refresh token
router.get('/refresh', users.refreshAccessToken);

//get user data
router.get('/', verifyJWT, users.getUserData);

//check ad ids
router.post('/check-id', verifyJWT, users.checkAdIds);

//forgot password
router.post('/forgot-pass', users.forgotPass);

//reset password from mail
router.patch('/reset-pass/:token', users.resetPass);

//update user data
router.patch('/update-data', verifyJWT, users.updateUserData);

//update password
router.patch('/update-pass', verifyJWT, users.updatePass);

//delete acc
router.post('/del', verifyJWT, users.deleteAcc);

module.exports = router;