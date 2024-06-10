const express = require('express');
const router = express.Router();
const ads = require('../controllers/adController');
const { upload } = require('../middleware/awsMiddleware')
// const multer = require('multer');
// const upload = multer();

//get all ads
router.get('/', ads.getAllAds);

//get ads by uni name
router.get('/uni/:uni', ads.getAdsByUniName);

//get user specific ads
router.get('/user/:id', ads.getUserAds);

//get one ad
router.get('/:id', ads.getAd);

//create ad
//.upload middleware adds images to the bucket
router.post('/', upload, ads.createAd);
// router.post('/', upload.array('photos', 4), ads.createAd);

//add review
router.post('/review/:id', ads.addReview)

//update ad
router.patch('/:id', ads.updateAd);

//update ad w new images
router.patch('/new/:id', upload, ads.updateAdwNewImgs);

//delete ad
router.delete('/:id', ads.deleteAd);

module.exports = router;