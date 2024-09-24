const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plateSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['48w', '96w', '384w']
  },
  ID: {
    type: String,
    required: true,
    unique: true
  },
  barcode: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  }
});

const Plate = mongoose.model('Plate', plateSchema);

module.exports = Plate;
