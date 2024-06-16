const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { genAccessToken, genRefreshToken } = require('../middleware/authMiddleware');

const cookieOptions = {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    // maxAge: 3 * 24 * 60 * 60 * 1000    //exp in 3d
    maxAge: 2 * 60 * 1000
}

//register user
const registerUser = async (req, res) => {
    const { name, email, contact, password } = req.body;

    try{
        const exists = await User.findOne({ email: email });
        if(exists) return res.status(400).json({ newUser: false, name: exists.name });  
        else {
            const salt = await bcrypt.genSalt(10);  //salt with 10 characters
            const hash = await bcrypt.hash(password, salt);                

            // const user = new User({ name, email, contact, password: hash, refreshToken: "" });
            const user = new User({ name, email, contact, password: hash });
            const accessToken = genAccessToken(user._id);
            const refreshToken = genRefreshToken(user._id);
            // user.refreshToken = refreshToken;

            const newUser = await user.save();
            if(!newUser) return res.status(500).json({ msg: 'Account creation failed' });            

            res.cookie("jwt", refreshToken, cookieOptions);   
            res.status(201).json({ accessToken, name: newUser.name, email: newUser.email });

        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const cookies = req.cookies;

    try{
        const user = await User.findOne({ email });
        if(!user) return res.status(404).json({ msg: 'New user' });
        else {
            const match = await bcrypt.compare(password, user.password);
            if(!match) return res.status(401).json({ msg: 'Incorrect password' });    
            
            const accessToken = genAccessToken(user._id);
            let refreshToken;

            // Check if user already has a refresh token 
            if (cookies?.jwt) {
                try{
                    jwt.verify(cookies.jwt, process.env.REFRESH_TOKEN_SECRET);
                    refreshToken = cookies.jwt;
                } catch (err) {
                    refreshToken = genRefreshToken(user._id);
                    res.cookie('jwt', refreshToken, cookieOptions)
                }
            } else {
                refreshToken = genRefreshToken(user._id);
                res.cookie('jwt', refreshToken, cookieOptions)
            }         

            // res.cookie('jwt', newRefreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            res.status(200).json({ accessToken, name: user.name, email: user.email });
        }
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//logout
const logoutUser = (req, res) => {
    const cookies = req.cookies;

    if(!cookies?.jwt) return res.status(204).json({ msg: 'No token' });

    res.clearCookie('jwt', {
        httpOnly: cookieOptions.httpOnly, 
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite,
    });
    res.status(200).json({ msg: 'logout success' });    
}

//refresh access token
const refreshAccessToken = (req, res) => {
    const cookies = req.cookies;

    if(!cookies?.jwt) return res.status(401).json({ msg: 'Unauthorized' });

    const refreshToken = cookies.jwt;
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
        if(err) return res.status(403).json({ error: err.message, msg: 'Forbidden'})

        const accessToken = genAccessToken(data.id);
        // const newRefreshToken = genRefreshToken(data.id);

        // res.cookie('jwt', newRefreshToken, cookieOptions)

        res.status(200).json({ accessToken });
    });
}

//get user data
const getUserData = async (req, res) => {
    const userId = req.user;

    try{
        if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ msg: "Invalid ID" });

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({ msg: 'No user found' });

        res.status(200).json({ name: user.name, contact: user.contact, email: user.email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//update user data
const updateUserData = async (req, res) => {
    const { editName, editEmail, editPhone } = req.body;
}

//update password
const updatePass = async (req, res) => {
    const { currPass, newPass, conPass } = req.body;
}

//delete acc
const deleteAcc = async (req, res) => {
    const { delPass } = req.body;
}

module.exports = { registerUser, loginUser, logoutUser, refreshAccessToken, getUserData, updateUserData, updatePass, deleteAcc };