const mongoose = require('mongoose');
const Admin = require('../models/adminModel');
const Ad = require('../models/adModel');
const User = require('../models/userModel');
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
        const exists = await Admin.findOne({ email: email });
        if(exists) return res.status(400).json({ msg: 'Email already exists' });  
        else {
            const salt = await bcrypt.genSalt(10);  
            const hash = await bcrypt.hash(password, salt);                
            
            const user = new Admin({ name, email, contact, password: hash });
            // const accessToken = genAccessToken(user._id);
            // const refreshToken = genRefreshToken(user._id);

            const newUser = await user.save();
            if(!newUser) return res.status(500).json({ msg: 'Account creation failed' });            

            // res.cookie("jwt", refreshToken, cookieOptions);   
            // res.status(201).json({ accessToken, name: newUser.name, email: newUser.email });
            res.status(201).json({ name: newUser.name, email: newUser.email });

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
        const user = await Admin.findOne({ email });
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

//get all ads
const getAllAds = async (req, res) => {
    try{
        const ads = await Ad.find({}).sort({ createdAt: -1 }); 
        const adImages = [];

        ads.forEach((ad) => {
            adImages.push(ad.images[0])
        })

        const imageUrls = await getImageUrls(adImages, 900);

        res.status(200).json({ads, imageUrls});
    }catch(err) {
        res.status(500).json({ error: err.message });
    }
}

//update ad status
const updateAdStatus = async (req, res) => {
    const id = req.params.id;
    const { status, emailMsg } = req.body;

    try{
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: 'Invalid ID. No such ad was found' });

        const ad = await Ad.findByIdAndUpdate(id, { status }, { new: true });
        if(!ad) return res.status(500).json({ msg: 'Failed to update ad' });

        const user = await User.findById(ad.user);

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
            to: user?.email,
            subject: 'Your Ad status has been updated.',
            html: `<h1>${ad.title}</h1>
            <p>${emailMsg}</p>
            <a href="http://localhost:3000/addetail?id=${ad._id}">view ad</a>`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if(err) return res.status(500).json({ error: err.message });
            // res.status(200).json({ msg: 'Email sent' });
            // console.log(err, info);
        }); 

        res.status(200).json({ msg: 'Ad updated', ad });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


module.exports = { registerUser, loginUser, logoutUser, refreshAccessToken, getAllAds, updateAdStatus }