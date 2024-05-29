const WorkCell = require('../models/WorkCells');

const addWorkCell = async (req, res) => {
  console.log('Request body:', req.body); // Log the request body

  const { name, description, id } = req.body;

  if (!name || !description || !id) {
    console.log('Validation failed');
    return res.status(400).json({ message: 'Name, description, and ID are required.' });
  }

  const newWorkCell = new WorkCell({
    name,
    description,
    id
  });

  try {
    const savedWorkCell = await newWorkCell.save();
    console.log('Saved workcell:', savedWorkCell); // Log the saved workcell
    res.status(201).json(savedWorkCell);
  } catch (error) {
    console.log('Error saving workcell:', error); // Log the error
    res.status(500).json({ message: 'Error adding workcell', error });
  }
};

module.exports = { addWorkCell };
