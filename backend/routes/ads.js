const express = require('express');
const router = express.Router();
const ads = require('../controllers/adController');

//get all ads
router.get('/', ads.getAllAds);

//get ads by uni name
router.get('/uni', ads.getAdsByUniName);

//get one ad
router.get('/:id', ads.getAd);

//update ad
router.put('/:id', ads.updateAd);

//delete ad
router.delete('/:id', ads.deleteAd);

module.exports = router;