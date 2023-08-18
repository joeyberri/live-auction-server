const mongoose = require('mongoose');
require('config/mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  
});

module.exports = mongoose.model('User', userSchema);
