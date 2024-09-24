const Plate = require('../models/PlateModel'); 

// Controller to add a new plate
const addPlate = async (req, res) => {
  const { type, ID, barcode, description } = req.body;

  // Ensure required fields are present
  if (!type || !ID || !barcode) {
    return res.status(400).json({ message: 'Type, ID, and barcode are required.' });
  }

  // Create a new Plate instance
  const newPlate = new Plate({
    type,
    ID,
    barcode,
    description
  });

  try {
    const savedPlate = await newPlate.save();
    res.status(201).json(savedPlate);
  } catch (error) {
    res.status(500).json({ message: 'Error adding plate', error });
  }
};

module.exports = { addPlate };
