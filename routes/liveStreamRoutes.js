// routes/liveStreamRoutes.js
const express = require('express');
const liveStreamController = require('../controllers/liveStreamController');

const router = express.Router();

router.post('/start', liveStreamController.startLiveStream);
router.get('/view/:streamKey', liveStreamController.viewLiveStream);

module.exports = router;
