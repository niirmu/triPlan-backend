const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  usersId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  name: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  urlImage: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  share: {
    type: Boolean,
    default: false
  }
 });
 module.exports = mongoose.model('Trip', tripSchema);