const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const { addUser } = require('./controller/userController');
const { addStatus } = require('./controller/statusController');
const { addWorkCell } = require('./controller/workCellsController');
const { addOrder, getOrders, getSummary, getWorkCellSummary, cancelOrder, updateOrderNote } = require('./controller/OrderController');
const { addPlate } = require('./controller/PlateController'); 
const { database } = require('./database');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));

// Using built-in middleware to parse JSON
app.use(express.json());

console.log('Setting up routes...');



// Route definitions
app.post('/users', addUser);
app.post('/workcells', addWorkCell);
app.post('/status', addStatus);
app.post('/orders', addOrder);
app.post('/plates', addPlate); // Correct route definition

app.get('/orders', getOrders);
app.get('/summary', getSummary);
app.get('/workcellSummary', getWorkCellSummary);

app.put('/orders/:id/cancel', cancelOrder);
app.put('/orders/:id/note',updateOrderNote);


console.log('Routes set up');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 8000;

const server = () => {
  database();

  app.listen(PORT, () => {
    console.log(`listening to: ${PORT}`);
  });
};

server();
