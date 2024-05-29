const User = require('../models/UserModel');

// Controller to add a new user
const addUser = async (req, res) => {
  const { fullname, initials } = req.body;

  if (!fullname || !initials) {
    return res.status(400).json({ message: 'Full name and initials are required.' });
  }

  const newUser = new User({
    fullname,
    initials
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error adding user', error });
  }
};

module.exports = { addUser };
