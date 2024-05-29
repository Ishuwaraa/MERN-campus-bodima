const mongoose = require('mongoose');
const Ad = require('../models/adModel');

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
        const { uniInput } = req.body;

        const ads = await Ad.find({ university: uniInput }).sort({ createdAt: -1 });
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

//update ad
const updateAd = async (req, res) => {
    try{
        const data = req.body;
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "Invalid ID. No such Ad was found" });

        const ad = await Ad.findByIdAndUpdate(id, {
            title: data.title,
            location: data.location, 
            contact: data.contact, 
            university: data.uniInput, 
            gender: data.gender, 
            bed: data.bed, 
            bathroom: data.bathroom, 
            price: data.price, 
            description: data.description
        });
        // }, { new: true });   //check if this is needed to return the updated doc in response

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

module.exports = { getAllAds, getAdsByUniName, getAd, updateAd, deleteAd };