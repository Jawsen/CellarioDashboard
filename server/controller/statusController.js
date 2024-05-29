const Status = require('../models/StatusModel'); // Adjust the path as necessary

// Controller to add a new status
const addStatus = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required.' });
  }

  const newStatus = new Status({
    name
  });

  try {
    const savedStatus = await newStatus.save();
    res.status(201).json(savedStatus);
  } catch (error) {
    res.status(500).json({ message: 'Error adding status', error });
  }
};

module.exports = { addStatus };
