const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  livestream: { type: mongoose.Schema.Types.ObjectId, ref: 'LiveStream', required: true },
  subscribedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  lastActivityAt: { type: Date },
  connectionType: { type: String },
});

module.exports = mongoose.model('Subscriber', subscriberSchema);
