const mongoose = require('mongoose');
const User = require('../models/userModel');

//register user
const registerUser = async (req, res) => {
    const { name, email, contact, password } = req.body;
}

//login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
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