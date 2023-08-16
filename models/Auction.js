const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  liveStreamId: { type: mongoose.Schema.Types.ObjectId, ref: 'LiveStream', required: true },
  // Other auction-related fields
});

module.exports = mongoose.model('Auction', auctionSchema);
