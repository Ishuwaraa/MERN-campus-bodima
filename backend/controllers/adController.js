const mongoose = require('mongoose');
const Ad = require('../models/adModel');
const Review = require('../models/reviewModel');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const { getImageUrls, deleteImages } = require('../middleware/awsMiddleware');

//get all ads
const getAllAds = async (req, res) => {
    try{
        const ads = await Ad.find({ status: 'approved' }).sort({ createdAt: -1 });  //latest first
        const adImages = [];

        ads.forEach((ad) => {
            adImages.push(ad.images[0])
        })
        // console.log(adImages);

        const imageUrls = await getImageUrls(adImages, 900);

        res.status(200).json({ads, imageUrls});
    }catch(err) {
        res.status(500).json({ error: err.message });
    }
}

//get ads by university
const getAdsByUniName = async (req, res) => {
    try{
        const { uni } = req.params;
        //gott validate the uni input here

        const ads = await Ad.find({ university: uni, status: 'approved' }).sort({ createdAt: -1 });
        if(ads.length == 0) return res.status(404).json({ msg: "No ads were found for that search"})        

        const adImages = [];
        ads.forEach((ad) => {
            adImages.push(ad.images[0])
        });

        const imageUrls = await getImageUrls(adImages, 900);        

        res.status(200).json({ ads, imageUrls });
    }catch(err) {
        res.status(500).json({ error: err.message });
    }
}

//get one ad
const getAd = async (req, res) => {
    try{
        const { id } = req.params;

        //checking if the id is a mongoose object id type
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "Invalid ID. No such Ad was found" });
    
        const ad = await Ad.findById(id);
        if(!ad) return res.status(404).json({ msg: 'No such ad was found' });

        const images = ad.images;
        // console.log('type', Array.isArray(ad.images));

        //doesnt work????!!!!!!!!
        // for(const image of images){
        //     const getObjectParams = {
        //         Bucket: process.env.S3_BUCKET_NAME,
        //         key: image
        //     }
        //     const command = new GetObjectCommand(getObjectParams);
        //     const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        //     imageUrls.push(url);
        // }

        //creating urls parallely
        //.map creates an array of promisses. promise.all waits for all them to resolve or reject        
        const imageUrls = await getImageUrls(images, 1800); 

        const user = await User.findById(ad.user);
        if(!user) return res.status(404).json({ msg: 'No user found' });
        // console.log(user);                
        
        res.status(200).json({ad, imageUrls, username: user?.name, useremail: user?.email });
    }catch(err) {
        res.status(500).json({ error: err.message });
    }
}

//create ad 
const createAd = async (req, res) => {
    const userId = req.user;
    const data = req.body;
    const files = req.files;
    const images = [];

    try{
        // console.log('type', Array.isArray(files));
        Object.values(files).forEach((file) => {
            images.push(file.key);
        })
        // console.log(images, data);

        const ad = await Ad.create({
            user: userId,
            title: data.title,
            location: data.location,
            latitude: data.lat,
            longitude: data.long, 
            contact: data.contact, 
            university: data.uniInput, 
            gender: data.gender, 
            bed: data.bed, 
            bathroom: data.bathroom, 
            price: data.price, 
            description: data.description,
            images: images,
            rating: 0,
            status: 'pending'
        });    
        if(!ad) return res.status(500).json({ msg: 'Error creating the ad' });

        const user = await User.findByIdAndUpdate(userId, {
            $push: { ads: ad._id }
        }, { new: true })
        if(!user) return res.status(500).json({ msg: 'Error updating user doc' });
        
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
            to: process.env.EMAIL_CLIENT,
            subject: 'Pending approval for a new Ad',
            html: `<h1>${data.title}</h1>
            <p>By ${user.name}</p>
            <a href="http://localhost:3000/ad-approve?id=${ad._id}">view ad</a>`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            // if(err) return res.status(500).json({ error: err.message });
            // res.status(200).json({ msg: 'Email sent' });
            // console.log(err, info);
        });        

        res.status(201).json(ad);
    }catch(err) {
        res.status(500).json({ error: err.message });
    }
}

//update ad with new images 
const updateAdwNewImgs = async (req, res) => {
    const data = req.body;
    const { id } = req.params;
    const files = req.files;

    try{
        // console.log('type', Array.isArray(files));
        // console.log(data, files);

        const newImages = [];
        Object.values(files).forEach((file) => {
            newImages.push(file.key);
        })

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "Invalid ID. No such Ad was found" });

        // //deleting old images
        const ad = await Ad.findById(id);
        if(!ad) return res.status(404).json({ msg: "Failed to update the ad. No such Ad was found." });
        const oldImages = ad.images;
        await deleteImages(oldImages);

        const newAd = await Ad.findByIdAndUpdate(id, {
            title: data.title,
            location: data.location, 
            latitude: data.lat,
            longitude: data.long,
            contact: data.contact, 
            university: data.uniInput, 
            gender: data.gender, 
            bed: data.bed, 
            bathroom: data.bathroom, 
            price: data.price, 
            description: data.description,
            images: newImages,
            status: 'pending'
        }, { new: true });  //return the updated doc in response

        if(!newAd) return res.status(500).json({ msg: "Update failed" });

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
            to: process.env.EMAIL_CLIENT,
            subject: 'Pending approval for an updated Ad',
            html: `<h1>${newAd.title}</h1>
            <a href="http://localhost:3000/ad-approve?id=${newAd._id}">view ad</a>`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            // if(err) return res.status(500).json({ error: err.message });
            // res.status(200).json({ msg: 'Email sent' });
            // console.log(err, info);
        }); 
        res.status(200).json({ msg: "Ad updated", newAd });
    }catch(err){
        res.status(500).json({ error: err.message })
    }
}

//update ad
const updateAd = async (req, res) => {
    const data = req.body;
    const { id } = req.params;

    try{
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "Invalid ID. No such Ad was found" });

        const ad = await Ad.findByIdAndUpdate(id, {
            title: data.title,
            location: data.location, 
            latitude: data.lat,
            longitude: data.long,
            contact: data.contact, 
            university: data.uniInput, 
            gender: data.gender, 
            bed: data.bed, 
            bathroom: data.bathroom, 
            price: data.price, 
            description: data.description,
            status: 'pending'
        }, { new: true });  //return the updated doc in response
        
        if(!ad) return res.status(500).json({ msg: "Update failed" }); 
        
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
            to: process.env.EMAIL_CLIENT,
            subject: 'Pending approval for an updated Ad',
            html: `<h1>${ad.title}</h1>
            <a href="http://localhost:3000/ad-approve?id=${ad._id}">view ad</a>`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            // if(err) return res.status(500).json({ error: err.message });
            // res.status(200).json({ msg: 'Email sent' });
            if(err) console.log(err, info);
        }); 
        res.status(200).json({ msg: "Ad updated", ad });
    }catch(err){
        res.status(500).json({ error: err.message })
    }
}

//delete ad - delete reviews here
const deleteAd = async (req, res) => {
    const id = req.params.id;
    const userId = req.user;

    try{
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "Invalid ID. No such Ad was found" });
        const ad = await Ad.findById(id); 

        if(!ad) return res.status(404).json({ msg: "No such Ad was found" });
        
        //get the image names and delete from s3 then delete the ad here
        const images = ad.images;

        await deleteImages(images);
        await Review.findByIdAndDelete(id);

        const deletedAd = await Ad.findByIdAndDelete(id);
        const user = await User.findByIdAndUpdate(userId, {
            $pull: { ads: id }
        }, { new: true });
        if(!user) return res.status(500).json({ msg: 'Error updating user doc' });

        res.status(200).json({ msg: "Ad deleted", deletedAd});
    }catch(err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getAllAds, getAdsByUniName, getAd, createAd, updateAdwNewImgs, updateAd, deleteAd };