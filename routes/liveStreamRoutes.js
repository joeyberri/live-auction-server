// routes/liveStreamRoutes.js
const express = require('express');
const liveStreamController = require('../controllers/liveStreamController');

const router = express.Router();

router.post('/create', liveStreamController.createLiveStream);
router.post('/:streamKey/subscribe', liveStreamController.subscribeLiveStream);
router.get('/list', liveStreamController.listLiveStreams);
router.post('/:streamKey/view-subscribed-users', liveStreamController.listSubscribedUsers);

module.exports = router;
