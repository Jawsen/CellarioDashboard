const Order = require('../models/OrdersModel');
const User = require('../models/UserModel');
const WorkCell = require('../models/WorkCells');
const Status = require('../models/StatusModel');
const Plate = require('../models/PlateModel');
const mongoose = require('mongoose');

const addOrder = async (req, res) => {
  const { description, owner, workCell, status, endDate, plates, notes, createdDate } = req.body;

  console.log('Request Body:', req.body); // Log the request body for inspection

  if (!description || !owner || !workCell || !status) {
    return res.status(400).json({ message: 'Description, Owner, WorkCell, and Status are required.' });
  }

  try {
    // 1. Find the owner by fullname
    const ownerDoc = await User.findOne({ fullname: owner });
    if (!ownerDoc) {
      console.log('Owner not found:', owner); // Log owner not found error
      return res.status(400).json({ message: 'Owner not found.' });
    }

    // 2. Find the work cell by name
    const workCellDoc = await WorkCell.findOne({ name: workCell });
    if (!workCellDoc) {
      console.log('WorkCell not found:', workCell); // Log work cell not found error
      return res.status(400).json({ message: 'WorkCell not found.' });
    }

    // 3. Find the status by name
    const statusDoc = await Status.findOne({ name: status });
    if (!statusDoc) {
      console.log('Status not found:', status); // Log status not found error
      return res.status(400).json({ message: 'Status not found.' });
    }

    // Log resolved ObjectIDs
    console.log('Resolved Owner ObjectId:', ownerDoc._id);
    console.log('Resolved WorkCell ObjectId:', workCellDoc._id);
    console.log('Resolved Status ObjectId:', statusDoc._id);

    // 4. Find the plates by barcode
    const plateDocs = [];
    for (const barcode of plates) {
      const plateDoc = await Plate.findOne({ barcode });
      if (!plateDoc) {
        console.log(`Plate with barcode ${barcode} not found`);
        return res.status(400).json({ message: `Plate with barcode ${barcode} not found.` });
      }
      plateDocs.push(plateDoc._id);
    }

    // 5. Create the new order with the resolved ObjectIDs
    const newOrder = new Order({
      Description: description,
      Owner: ownerDoc._id, // Use ObjectID of the owner
      WorkCell: workCellDoc._id, // Use ObjectID of the work cell
      Status: statusDoc._id, // Use ObjectID of the status
      EndDate: endDate,
      Plates: plateDocs, // Use ObjectIDs of the plates
      Note: notes,
      CreatedDate: createdDate || Date.now(),
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error adding order:', error);
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

  try {
    // Find the order by its auto-incremented ID
    const order = await Order.findOne({ ID: id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Find the "Canceled" status (note the single "L")
    const canceledStatus = await Status.findOne({ name: 'Canceled' });
    if (!canceledStatus) {
      return res.status(400).json({ message: 'Canceled status not found' });
    }

    // Update the order status to 'Canceled'
    order.Status = canceledStatus._id;
    await order.save();

    res.status(200).json(order); // Return the updated order
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Error cancelling order', error });
  }
};



const updateOrderNote = async (req, res) => {
  const { id } = req.params; // This is the auto-incremented ID, not the ObjectId
  const { note } = req.body;

  try {
    // Find the order by custom auto-incremented ID
    const order = await Order.findOne({ ID: id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the note field
    order.Note = note;
    await order.save();

    res.json(order); // Send the updated order back as a response
  } catch (err) {
    console.error('Error saving note:', err);
    res.status(500).json({ message: err.message });
  }
};



module.exports = { addOrder, getOrders, getSummary, getWorkCellSummary, cancelOrder, updateOrderNote };
