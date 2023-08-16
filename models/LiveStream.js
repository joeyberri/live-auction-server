const mongoose = require('mongoose');

const liveStreamSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  streamKey: { type: String, required: true, unique: true },
  startedAt: { type: Date, default: Date.now },
  // Other live stream-related fields
});

module.exports = mongoose.model('LiveStream', liveStreamSchema);
