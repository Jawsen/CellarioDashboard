const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Status schema
const statusSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  ID: {
    type: Number,
    unique: true
  }
});

// Create the Status model
const Status = mongoose.model('Status', statusSchema);

module.exports = Status;
