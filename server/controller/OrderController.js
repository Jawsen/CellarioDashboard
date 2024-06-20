const Order = require('../models/OrdersModel');
const User = require('../models/UserModel');
const WorkCell = require('../models/WorkCells');
const Status = require('../models/StatusModel');

// Controller to add a new order
const addOrder = async (req, res) => {
  const { Description, Owner, WorkCell: WorkCellId, Status: StatusId, EndDate } = req.body;

  if (!Description || !Owner || !WorkCellId || !StatusId) {
    return res.status(400).json({ message: 'Description, Owner, WorkCell, and Status are required.' });
  }

  try {
    // Check if the owner exists
    const ownerExists = await User.findById(Owner);
    if (!ownerExists) {
      return res.status(400).json({ message: 'Owner not found.' });
    }

    // Check if the workcell exists
    const workCellExists = await WorkCell.findById(WorkCellId);
    if (!workCellExists) {
      return res.status(400).json({ message: 'WorkCell not found.' });
    }

    // Check if the status exists
    const statusExists = await Status.findById(StatusId);
    if (!statusExists) {
      return res.status(400).json({ message: 'Status not found.' });
    }

    const newOrder = new Order({
      Description,
      Owner,
      WorkCell: WorkCellId,
      Status: StatusId,
      EndDate  
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error adding order', error });
  }
};

 const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('Owner').populate('WorkCell').populate('Status');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 

const getSummary = async (req, res) => {
  try {
    const orders = await Order.find().populate('Owner').populate('WorkCell').populate('Status');
    const statusSummary = orders.reduce((acc, order) => {
      const statusName = order.Status.name;
      acc[statusName] = (acc[statusName] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalOrders: orders.length,
      statusCounts: statusSummary
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
  
  module.exports = { addOrder, getOrders, getSummary};
