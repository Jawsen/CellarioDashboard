const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  WorkCell: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkCell',
    required: true
  },
  CreatedDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  EndDate: {
    type: Date
  },
  Status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status',
    required: true
  },
  Plates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plate'
  }],
  Note: {
    type: String,
    default: ''
  }
});

OrderSchema.plugin(AutoIncrement, { inc_field: 'ID', start_seq: 1001 });

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
