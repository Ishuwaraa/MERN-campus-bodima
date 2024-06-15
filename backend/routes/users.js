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

//update user data
router.post('/update-data', users.updateUserData);

//update password
router.post('/update-pass', users.updatePass);

//delete acc
router.post('/del', users.deleteAcc);

module.exports = router;