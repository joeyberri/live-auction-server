const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  liveStream: { type: mongoose.Schema.Types.ObjectId, ref: 'LiveStream', required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
