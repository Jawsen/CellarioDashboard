const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the WorkCells schema
const workCellSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  }
});

// Create the WorkCells model
const WorkCell = mongoose.model('WorkCell', workCellSchema);

module.exports = WorkCell;
