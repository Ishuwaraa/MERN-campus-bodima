const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateAuthToken } = require('../middleware/authMiddleware');

//register user
const registerUser = async (req, res) => {
    const { name, email, contact, password } = req.body;

    try{
        const exists = await User.find({ email: email });
        if(exists.length !== 0) return res.status(200).json({ newUser: false, name: exists[0].name });
        else {
            const salt = await bcrypt.genSalt(10);  //salt with 10 characters
            const hash = await bcrypt.hash(password, salt);                

            const user = new User({ name, email, contact, password: hash, refreshToken: "" });
            const tokens = generateAuthToken(user._id);
            user.refreshToken = tokens.refreshToken;

            const newUser = await user.save();
            if(!newUser) return res.status(301).json({ msg: 'Account creation failed' });

            const accessToken = tokens.accessToken;
            const refreshToken = tokens.refreshToken;

            res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });   //exp in 1d
            res.status(201).json({ accessToken, newUser });

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
        const exists = await User.find({ email });
        if(exists.length === 0) return res.status(404).json({ newUser: true });
        else {
            const match = await bcrypt.compare(password, exists[0].password);
            if(!match) return res.status(401).json({ msg: 'Incorrect password' });

            // let newRefreshTokenArray = "";

            // //check if user has an existing refresh token
            // if(!cookies.jwt) exists[0].refreshToken = cookies.jwt;
            // else {
            //     exists[0].refreshToken = cookies.jwt;
            // }


            res.status(200).json({ name: exists[0].name, email: exists[0].email });
        }
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//logout

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

module.exports = { registerUser, loginUser, updateUserData, updatePass, deleteAcc };