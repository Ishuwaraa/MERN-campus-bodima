const mongoose = require('mongoose');
const Ad = require('../models/adModel');
const { S3Client, ListBucketsCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require('multer');
const multerS3 = require('multer-s3');

//get all ads
const getAllAds = async (req, res) => {
    try{
        const ads = await Ad.find({}).sort({ createdAt: -1 });  //latest first
        res.status(200).json(ads);
    }catch(err) {
        res.status(500).json({ error: err.message });
    }
}

//get ads by university
const getAdsByUniName = async (req, res) => {
    try{
        const { uni } = req.params;
        //gott validate the uni input here

        const ads = await Ad.find({ university: uni }).sort({ createdAt: -1 });
        if(ads.length == 0) return res.status(404).json({ msg: "No ads were found for that search"})
        res.status(200).json(ads);
    }catch(err) {
        res.status(500).json({ error: err.message });
    }
}

//get user specific ads
const getUserAds = async (req, res) => {
    try{
        // const { id } = req.params;
        const { id } = req.body;
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "Invalid user ID" });

        const ads = await Ad.find({ user: id }).sort({ createdAd: -1 });
        if(ads.length == 0) return res.status(404).json({ msg: "No ads were found for that search"})
        res.status(200).json(ads);
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

        if(!ad) res.status(404).json({ msg: "No such Ad was found" });
        
        res.status(200).json(ad);
    }catch(err) {
        res.status(500).json({ error: err.message });
    }
}

//create ad -
const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
    },
    region: process.env.S3_BUCKET_REGION
});

//uploading to the bucket
const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.S3_BUCKET_NAME,
        metadata: function (req, file, nextFunc) {
            nextFunc(null, { fieldName: file.fieldname })
        },
        key: function (req, file, nextFunc) {
            nextFunc(null, `${Date.now().toString()}-${file.originalname}`);    //generating a unique image name
        }
    })
}).array('photos', 4);

const createAd = async (req, res) => {
    try{
        const data = req.body;
        const files = req.files;
        const images = [];
        console.log('type', Array.isArray(files));
        Object.values(files).forEach((file) => {
            images.push(file.location);
        })
        console.log(images);
        // res.status(201).json({ text: data, files});

        const ad = await Ad.create({
            user: data.userId,
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
            images: images
        });
        res.status(201).json(ad);
    }catch(err) {
        res.status(500).json({ error: err.message });
    }
}

//add review
const addReview = async (req, res) => {
    try{
        const id = req.params.id;
        const { username, roomRate, locationRate, bathroomRate, review } = req.body;

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "Invalid ID. No such Ad was found" });

        const data = await Ad.findByIdAndUpdate(id, {    
            $push: {
                reviews: {
                    user: username,
                    room: roomRate,
                    location: locationRate,
                    bathroom: bathroomRate,
                    review
                }
            }                                                
        }, { new: true });
        if(!data) return res.status(404).json({ msg: "Unable to add review"})
        res.status(201).json(data);
    }catch(err) {
        res.status(500).json({ error: err.message })
    }
}

//update ad
const updateAd = async (req, res) => {
    try{
        const data = req.body;
        const { id } = req.params;

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
            description: data.description
        // });
        }, { new: true });  //return the updated doc in response

        if(!ad) return res.status(404).json({ msg: "Update failed" });
        res.status(200).json({ msg: "Ad updated", ad });
    }catch(err){
        res.status(500).json({ error: err.message })
    }
}

//delete ad
const deleteAd = async (req, res) => {
    try{
        const id = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "Invalid ID. No such Ad was found" });
        const ad = await Ad.findByIdAndDelete(id);

        if(!ad) return res.status(404).json({ msg: "Delete request failed" });
        res.status(200).json({ msg: "Workout deleted", ad});
    }catch(err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getAllAds, getAdsByUniName, getUserAds, getAd, createAd, addReview, updateAd, deleteAd, upload };