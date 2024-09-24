const Order = require('../models/OrdersModel');
const User = require('../models/UserModel');
const WorkCell = require('../models/WorkCells');
const Status = require('../models/StatusModel');
const Plate = require('../models/PlateModel');
const mongoose = require('mongoose');

const addOrder = async (req, res) => {
  const { Description, Owner, WorkCell: WorkCellId, Status: StatusId, EndDate, Plates } = req.body;

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

    const plateIds = [];
    if (Plates) {
      for (const plateId of Plates) {
        const plateExists = await Plate.findById(plateId);
        if (!plateExists) {
          return res.status(400).json({ message: `Plate with ID ${plateId} not found.` });
        }
        plateIds.push(plateId);
      }
    }

    const newOrder = new Order({
      Description,
      Owner,
      WorkCell: WorkCellId,
      Status: StatusId,
      EndDate,
      Plates: plateIds,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error adding order', error });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('Owner').populate('WorkCell').populate('Status').populate('Plates');
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
      statusCounts: statusSummary,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getWorkCellSummary = async (req, res) => {
  try {
    const orders = await Order.find().populate('WorkCell').populate('Status');

    const summary = {};

    orders.forEach((order) => {
      const statusName = order.Status.name;
      const workCellName = order.WorkCell.name;

      if (!summary[workCellName]) {
        summary[workCellName] = {};
      }
      if (!summary[workCellName][statusName]) {
        summary[workCellName][statusName] = 0;
      }

      summary[workCellName][statusName]++;
    });

    res.json({ summary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const cancelOrder = async (req, res) => {
  const { id } = req.params;
  console.log(`Cancel request received for order ID: ${id}`);

  try {
    const orderId = isNaN(id) ? mongoose.Types.ObjectId(id) : parseInt(id, 10);

    const order = await Order.findOne({ _id: orderId });
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

const updateOrderNote = async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.Note = note;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addOrder, getOrders, getSummary, getWorkCellSummary, cancelOrder, updateOrderNote };
