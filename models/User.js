const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  externalId: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('User', userSchema);
