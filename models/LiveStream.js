const mongoose = require('mongoose');

const liveStreamSchema = new mongoose.Schema({
  producerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true, unique: true },
  streamKey: { type: String, required: true, unique: true },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('LiveStream', liveStreamSchema);
