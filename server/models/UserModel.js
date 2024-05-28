const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema
const userSchema = new Schema({

  fullname: {
    type: String,
    required: true,
    maxlength: 50
  },
  Intials: {
    type: String,
    required: true,
    maxlength: 50
  },
  default: true
  }
});

// Create the model
const User = mongoose.model('User', userSchema);

module.exports = User;
