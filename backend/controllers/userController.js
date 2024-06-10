const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

//register user
const registerUser = async (req, res) => {
    const { name, email, contact, password } = req.body;

    try{
        const exists = await User.find({ email: email });
        if(exists.length !== 0) return res.status(200).json({ oldUser: true, name: exists[0].name });
        else {
            const salt = await bcrypt.genSalt(10);  //salt with 10 characters
            const hash = await bcrypt.hash(password, salt);
    
            const user = await User.create({ name, email, contact, password: hash });
            res.status(201).json({ name: user.name, email: user.email });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try{
        const exists = await User.find({ email });
        if(exists.length === 0) return res.status(404).json({ newUser: true });
        else {
            const match = await bcrypt.compare(password, exists[0].password);
            if(!match) return res.status(403).json({ msg: 'Forbidden' });
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