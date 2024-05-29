const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
   
  },
  initials: {  
    type: String,
    required: true,
  }
 
});

// Create the model
const User = mongoose.model('User', userSchema);

module.exports = User;
