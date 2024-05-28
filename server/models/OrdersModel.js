const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Define the schema
const OrderSchema = new Schema({
  ID: {
    type: Number,
    unique: true
  },
  Description: {
    type: String,
    required: true
  },
  Owner: {
    type: mongoose.Schema.Types.ObjectId,   // Reference to the User model 
    ref: 'User',
    required: true
  },
  WorkCell: {
    type: Number,
    required: true
  },
  CreatedDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  Status: {
    type: Number,
    required: true
  }
});

// Add auto-increment for the ID field
OrderSchema.plugin(AutoIncrement, { inc_field: 'ID', start_seq: 1001 });

// Create the model
const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
