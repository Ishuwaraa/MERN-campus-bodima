const mongoose = require('mongoose');
const User = require('../models/userModel');
const Ad = require('../models/adModel');
const Review = require('../models/reviewModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { genAccessToken, genRefreshToken, genResetPassToken } = require('../middleware/authMiddleware');
const { getImageUrls, deleteImages } = require('../middleware/awsMiddleware');

const cookieOptions = {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    // maxAge: 3 * 24 * 60 * 60 * 1000    //exp in 3d
    maxAge: 24 * 60 * 60 * 1000
}

//register user
const registerUser = async (req, res) => {
    const { name, email, contact, password } = req.body;

    try{
        const exists = await User.findOne({ email: email });
        if(exists) return res.status(400).json({ msg: 'Email already exists' });  
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
        if(!user) return res.status(404).json({ msg: "Email doesn't exist" });
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

    if(!cookies?.jwt) return res.status(401).json({ msg: 'No token' });

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
        const newRefreshToken = genRefreshToken(data.id);

        res.cookie('jwt', newRefreshToken, cookieOptions)

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

        const ads = await Ad.find({ user: userId });
        const adImages = [];
        if(ads.length > 0) {
            ads.forEach((ad) => {
                adImages.push(ad.images[0])
            });

        }
        const imageUrls = await getImageUrls(adImages, 900);         

        res.status(200).json({ name: user.name, contact: user.contact, email: user.email, ads, imageUrls });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const checkAdIds = async (req, res) => {
    const userId = req.user;
    const { adId } = req.body;

    try{
        if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ msg: "Invalid user ID" });
        if(!mongoose.Types.ObjectId.isValid(adId)) return res.status(400).json({ msg: "Invalid ad ID" });

        const user = await User.findById(userId);
        const valid = user.ads.includes(adId);

        if (!valid) return res.status(403).json({ msg: 'Unauthorized' }); 

        // console.log(valid);
        res.sendStatus(200);
        
    } catch (err) { 
        res.status(500).json({ error: err.message });
    }
}

//update user data
const updateUserData = async (req, res) => {
    const userId = req.user;
    const { editName, editEmail, editPhone } = req.body;

    try{
        if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ msg: "Invalid ID" });

        const user = await User.findByIdAndUpdate(userId, {
            name: editName,
            email: editEmail,
            contact: editPhone
        }, { new: true });
        
        if(!user) return res.status(500).json({ msg: 'Update failed' });
        res.status(200).json({ name: user.name, email: user.email, contact: user.contact });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//update password
const updatePass = async (req, res) => {
    const userId = req.user;
    const { currPass, newPass } = req.body;

    try{
        if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ msg: "Invalid ID" });

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({ msg: 'No user found' });

        const match = await bcrypt.compare(currPass, user.password);
        if(!match) return res.status(404).json({ msg: 'Incorrect password' });
        
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPass, salt);

        const newUser = await User.findByIdAndUpdate(userId, { password: hash });
        if(!newUser) return res.status(500).json({ msg: 'Error updating password' });

        res.clearCookie('jwt', {
            httpOnly: cookieOptions.httpOnly, 
            secure: cookieOptions.secure,
            sameSite: cookieOptions.sameSite,
        });
        res.status(200).json({ msg: 'Password updated successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//delete acc
const deleteAcc = async (req, res) => {
    const userId = req.user;
    const { delPass } = req.body;

    //delete images from s3, delete ad, delete ad reviews, delete user posted reviews, clear cookie    
    try{
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({ msg: 'No user found' });

        const match = await bcrypt.compare(delPass, user.password);
        if(!match) return res.status(400).json({ msg: 'Incorrect passwrord' });

        const adIds = user.ads;
        const adImages = [];
        
        if(adIds.length !== 0){
            for(const id of adIds){
                const ad = await Ad.findById(id);
                // if(!ad) return res.status(404).json({ msg: 'No ad was found' });
    
                ad.images.forEach((image) => {
                    adImages.push(image);
                })
            }

            try{
                await deleteImages(adImages);            
            } catch (err) {
                return res.status(500).json({ msg: 'Error deleting images' });
            }

            for(const id of adIds){
                const review = await Review.findByIdAndDelete(id);
                // if(!review) return res.status(404).json({ msg: 'No review doc found' });
    
                await Ad.findByIdAndDelete(id);
            }
        }

        //deleting reviews posted by the user
        // const reviews = await Review.updateMany(
        //     {},
        //     { $pull: { reviews: { userId: userId }}}
        // )
                
        const deleted = await User.findByIdAndDelete(userId);
        if(!deleted) return res.status(500).json({ msg: 'Error deleting account' });

        res.clearCookie('jwt', {
            httpOnly: cookieOptions.httpOnly, 
            secure: cookieOptions.secure,
            sameSite: cookieOptions.sameSite,
        });
        res.status(200).json({ msg: 'Your account has been deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//forgot password
const forgotPass = async (req, res) => {
    const { email } = req.body;

    try{
        const user = await User.findOne({ email });
        if(!user) return res.status(404).json({ msg: 'Invalid email' });

        const resetPassToken = genResetPassToken(user._id);

        //sending token to the user's email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.RESET_EMAIL_CLIENT,
                pass: process.env.RESET_EMAIL_PASS,
            }
        });

        //email configuration
        const mailOptions = {
            from: process.env.RESET_EMAIL_CLIENT,
            to: email,
            subject: 'Reset Password',
            html: `<h1>Reset Your Password</h1>
            <p>Click on the following link to reset your password:</p>
            <a href="http://localhost:3000/reset-password?token=${resetPassToken}">http://localhost:3000/reset-password?token=${resetPassToken}</a>
            <p>This link will expire in 10 minutes.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if(err) return res.status(500).json({ error: err.message });
            res.status(200).json({ msg: 'Email sent' });
        });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//reset password 
const resetPass = async (req, res) => {
    const token = req.params.token;
    const { password } = req.body;

    try{
        const decoded = jwt.verify(token, process.env.RESET_PASS_TOKEN_SECRET);
        if(!decoded) return res.status(401).json({ msg: 'Invalid token' });

        const user = await User.findById(decoded.id);
        if(!user) return res.status(404).json({ msg: 'No user found' });

        const salt = await bcrypt.genSalt(10);  
        const hash = await bcrypt.hash(password, salt);  

        const updated = await User.findByIdAndUpdate(decoded.id, { password: hash }, { new: true });
        if(!updated) return res.status(500).json({ msg: 'Error updating password' });
        
        res.status(200).json({ msg: 'Password updated successfully' });

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

module.exports = { registerUser, loginUser, logoutUser, refreshAccessToken, getUserData, 
    checkAdIds, updateUserData, updatePass, deleteAcc, forgotPass, resetPass };