const mongoose = require('mongoose');

const attractionsSchema = new mongoose.Schema({
  name: {
      type: String,
      default: ''
  },
  type: {
      type: String,
      default: ''
  },
  startHour: {
      type: String,
      default: ''
  },
  endHour: {
      type: String,
      default: ''
  },
  description: {
      type: String,
      default: ''
  },
  hoursOpen: {
      type: Array,
      default: ''
  },
  url: {
      type: String,
      default: ''
  },
  // DayId: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Day'
  //   },
});

const daySchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  },
  //the date for scroll date must to be key
  key: {
    type: String,
    default: ''
  },
  //the date for scroll date must to be title
  title: {
    type: String,
    default: ''
  } ,
    data: [attractionsSchema]
});

module.exports = mongoose.model('Day', daySchema );
module.exports = mongoose.model('Attraction' ,attractionsSchema );
