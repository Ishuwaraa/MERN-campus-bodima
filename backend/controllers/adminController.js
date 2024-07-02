const mongoose = require('mongoose');
const Admin = require('../models/adminModel');
const Ad = require('../models/adModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { genAccessToken, genRefreshToken, genResetPassToken } = require('../middleware/authMiddleware');
const { getImageUrls, deleteImages } = require('../middleware/awsMiddleware');

const cookieOptions = {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 3 * 24 * 60 * 60 * 1000    //exp in 3d
    // maxAge: 24 * 60 * 60 * 1000
}

//register user
const registerUser = async (req, res) => {
    const { name, email, contact, password } = req.body;
    const convEmail = email.toLowerCase();

    try{
        const exists = await Admin.findOne({ email: convEmail });
        if(exists) return res.status(400).json({ msg: 'Email already exists' });  
        else {
            const salt = await bcrypt.genSalt(10);  
            const hash = await bcrypt.hash(password, salt);                
            
            const user = new Admin({ name, email: convEmail, contact, password: hash });
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
    const convEmail = email.toLowerCase();

    try{
        const user = await Admin.findOne({ email: convEmail });
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

//get admin data
const getAdminData = async (req, res) => {
    const userId = req.user;

    try{
        if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ msg: "Invalid ID" });

        const user = await Admin.findById(userId);
        if(!user) return res.status(404).json({ msg: 'No user found' });               

        res.status(200).json({ name: user.name, contact: user.contact, email: user.email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//get all users
const getAllUsers = async (req, res) => {
    try{
        const users = await User.find().sort({ createdAt: -1 });

        const names = [];
        const emails = [];
        const contacts = [];
        const createdDate = [];

        users.forEach((user) => {
            names.push(user.name);
            emails.push(user.email);
            contacts.push(user.contact);
            createdDate.push(user.createdAt);
        })

        res.status(200).json({ names, emails, contacts, createdDate });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

//get all ads
const getAllAds = async (req, res) => {
    try{
        const ads = await Ad.find({}).sort({ createdAt: -1 }); 
        const adImages = [];

        ads.forEach((ad) => {
            adImages.push(ad.images[0])
        })

        const imageUrls = await getImageUrls(adImages, 3600);

        res.status(200).json({ads, imageUrls});
    }catch(err) {
        res.status(500).json({ error: err.message });
    }
}

//update ad status
const updateAdStatus = async (req, res) => {
    const id = req.params.id;
    const { status, emailMsg, emailSubject } = req.body;

    try{
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: 'Invalid ID. No such ad was found' });

        const ad = await Ad.findByIdAndUpdate(id, { status }, { new: true });
        if(!ad) return res.status(500).json({ msg: 'Failed to update ad' });

        const user = await User.findById(ad.user);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_CLIENT,
                pass: process.env.EMAIL_PASS,
            }
        });

        //email configuration
        const mailOptions = {
            from: process.env.EMAIL_CLIENT,
            to: user?.email,
            subject: emailSubject,
            html: `<p>Hello ${user?.name},</p>
            <p>${emailMsg}</p>
            <p>View your ad <a href="https://campusbodima.vercel.app/addetail?id=${ad._id}">here</a></p>`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if(err) return res.status(500).json({ msg: err.message });
            // res.status(200).json({ msg: 'Email sent' });
            // console.log(err, info);
        }); 

        res.status(200).json({ msg: 'Ad updated', ad });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

const deleteAd = async (req, res) => {
    const id = req.params.id;
    const { emailMsg } = req.body;

    try{
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "Invalid ID. No such Ad was found" });
        const ad = await Ad.findById(id); 

        if(!ad) return res.status(404).json({ msg: "No such Ad was found" });
        
        //get the image names and delete from s3 then delete the ad here
        const images = ad.images;

        await deleteImages(images);    
        await Review.findByIdAndDelete(id);

        const user = await User.findByIdAndUpdate(ad.user, {
            $pull: { ads: id }
        }, { new: true });
        if(!user) return res.status(500).json({ msg: 'Error updating user doc' });

        const deletedAd = await Ad.findByIdAndDelete(id);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_CLIENT,
                pass: process.env.EMAIL_PASS,
            }
        });

        //email configuration
        const mailOptions = {
            from: process.env.EMAIL_CLIENT,
            to: user?.email,
            subject: 'Ad has been deleted',
            html: `<p>Hello ${user?.name},</p>
            <p>${emailMsg}</p>`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if(err) return res.status(500).json({ msg: err.message });
            // res.status(200).json({ msg: 'Email sent' });
            // console.log(err, info);
        }); 

        res.status(200).json({ msg: "Ad deleted", deletedAd});
    }catch(err) {
        res.status(500).json({ msg: err.message });
    }
}

//update admin data
const updateAdminData = async (req, res) => {
    const userId = req.user;
    const { editName, editEmail, editPhone } = req.body;
    const convEmail = editEmail.toLowerCase();

    try{
        if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ msg: "Invalid ID" });

        const user = await Admin.findByIdAndUpdate(userId, {
            name: editName,
            email: convEmail,
            contact: editPhone
        }, { new: true });
        
        if(!user) return res.status(500).json({ msg: 'Update failed' });
        res.status(200).json({ name: user.name, email: user.email, contact: user.contact });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//update admin pass
const updateAdminPass = async (req, res) => {
    const userId = req.user;
    const { currPass, newPass } = req.body;

    try{
        if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ msg: "Invalid ID" });

        const user = await Admin.findById(userId);
        if(!user) return res.status(404).json({ msg: 'No user found' });

        const match = await bcrypt.compare(currPass, user.password);
        if(!match) return res.status(404).json({ msg: 'Incorrect password' });
        
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPass, salt);

        const newUser = await Admin.findByIdAndUpdate(userId, { password: hash });
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

//delete admin acc
const deleteAdminAcc = async (req, res) => {
    const userId = req.user;
    const { delPass } = req.body;
      
    try{
        const user = await Admin.findById(userId);
        if(!user) return res.status(404).json({ msg: 'No user found' });

        const match = await bcrypt.compare(delPass, user.password);
        if(!match) return res.status(400).json({ msg: 'Incorrect passwrord' });
                        
        const deleted = await Admin.findByIdAndDelete(userId);
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
    const convEmail = email.toLowerCase();

    try{
        const user = await Admin.findOne({ email: convEmail });
        if(!user) return res.status(404).json({ msg: 'Invalid email' });

        const resetPassToken = genResetPassToken(user._id);

        //sending token to the user's email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_CLIENT,
                pass: process.env.EMAIL_PASS,
            }
        });

        //email configuration
        const mailOptions = {
            from: process.env.EMAIL_CLIENT,
            to: convEmail,
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

        const user = await Admin.findById(decoded.id);
        if(!user) return res.status(404).json({ msg: 'No user found' });

        const salt = await bcrypt.genSalt(10);  
        const hash = await bcrypt.hash(password, salt);  

        const updated = await Admin.findByIdAndUpdate(decoded.id, { password: hash }, { new: true });
        if(!updated) return res.status(500).json({ msg: 'Error updating password' });
        
        res.status(200).json({ msg: 'Password updated successfully' });

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

module.exports = { registerUser, loginUser, logoutUser, refreshAccessToken, getAdminData,
     getAllUsers, getAllAds, updateAdStatus, deleteAd, updateAdminData, updateAdminPass, deleteAdminAcc, resetPass, forgotPass }