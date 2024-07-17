const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { addUser } = require('./controller/userController');
const { addStatus } = require('./controller/statusController');
const { addWorkCell } = require('./controller/workCellsController');
const { addOrder, getOrders, getSummary, getWorkCellSummary, cancelOrder } = require('./controller/OrderController');
const { database } = require('./database');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT'],
  credentials: true,
}));

app.use(bodyParser.json());

app.post('/users', addUser);
app.post('/workcells', addWorkCell);
app.post('/status', addStatus);
app.post('/orders', addOrder);
app.get('/orders', getOrders);
app.get('/summary', getSummary);
app.get('/workcellSummary', getWorkCellSummary);

app.put('/orders/:id/cancel', cancelOrder);

const PORT = process.env.PORT;

const server = () => {
  database();

  app.listen(PORT, () => {
    console.log('listening to:', PORT);
  });
};

server();
