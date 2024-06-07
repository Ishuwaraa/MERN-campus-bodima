const express = require('express');
const router = express.Router();
const ads = require('../controllers/adController');
// const multer = require('multer');
// const upload = multer();

//get all ads
router.get('/', ads.getAllAds);

//get ads by uni name
router.get('/uni/:uni', ads.getAdsByUniName);

//get user specific ads
router.get('/user', ads.getUserAds);

//get one ad
router.get('/:id', ads.getAd);

//create ad
//.upload middleware adds images to the bucket
router.post('/', ads.upload, ads.createAd);
// router.post('/', upload.array('photos', 4), ads.createAd);
// router.post('/', ads.createAd);

//add review
router.post('/review/:id', ads.addReview)

//update ad
router.patch('/:id', ads.updateAd);

//delete ad
router.delete('/:id', ads.deleteAd);

module.exports = router;