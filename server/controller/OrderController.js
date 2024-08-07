const Order = require('../models/OrdersModel');
const User = require('../models/UserModel');
const WorkCell = require('../models/WorkCells');
const Status = require('../models/StatusModel');
const mongoose = require('mongoose');


const addOrder = async (req, res) => {
  const { Description, Owner, WorkCell: WorkCellId, Status: StatusId, EndDate } = req.body;

  if (!Description || !Owner || !WorkCellId || !StatusId) {
    return res.status(400).json({ message: 'Description, Owner, WorkCell, and Status are required.' });
  }

  try {
   
    const ownerExists = await User.findById(Owner);
    if (!ownerExists) {
      return res.status(400).json({ message: 'Owner not found.' });
    }

    
    const workCellExists = await WorkCell.findById(WorkCellId);
    if (!workCellExists) {
      return res.status(400).json({ message: 'WorkCell not found.' });
    }

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

const getWorkCellSummary = async (req, res) => {
  try {
    const orders = await Order.find().populate('WorkCell').populate('Status');

    // Initialize an object to store counts by work cell and status
    const summary = {};

    // Count orders by work cell and status
    orders.forEach(order => {
      const statusName = order.Status.name;
      const workCellName = order.WorkCell.name; // Assuming WorkCell has a 'name' property

      // Initialize counts if they don't exist
      if (!summary[workCellName]) {
        summary[workCellName] = {};
      }
      if (!summary[workCellName][statusName]) {
        summary[workCellName][statusName] = 0;
      }

      // Increment count
      summary[workCellName][statusName]++;
    });

    res.json({ summary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const cancelOrder = async (req, res) => {
  const { id } = req.params;
  console.log(`Cancel request received for order ID: ${id}`); // Log the received ID

  try {
    // If ID is a string representation of a number, convert it to a number
    const orderId = isNaN(id) ? mongoose.Types.ObjectId(id) : parseInt(id, 10);

    const order = await Order.findOne({ ID: orderId }); // Using the correct field name for ID
    if (!order) {
      console.error(`Order with ID ${id} not found`);
      return res.status(404).json({ message: 'Order not found' });
    }

    const canceledStatus = await Status.findOne({ name: 'Canceled' });
    if (!canceledStatus) {
      console.error('Canceled status not found');
      return res.status(400).json({ message: 'Canceled status not found' });
    }

    order.Status = canceledStatus._id;
    await order.save();
    console.log(`Order with ID ${id} canceled successfully`);

    res.status(200).json({ message: 'Order canceled successfully', order });
  } catch (error) {
    console.error('Error canceling order:', error);
    res.status(500).json({ message: 'Error canceling order', error });
  }
};
    
  

module.exports = { addOrder, getOrders, getSummary, getWorkCellSummary, cancelOrder };