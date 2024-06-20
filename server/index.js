const express = require('express');
require('dotenv').config();
const cors = require('cors');
const{mongoose} = require('mongoose');
const bodyParser = require('body-parser');
const { addUser } = require('./controller/userController');
const { addStatus } = require('./controller/statusController');
const { addWorkCell } = require('./controller/workCellsController');
const { addOrder } = require('./controller/OrderController');
const { database } = require('./database');
const { getOrders } = require('./controller/OrderController');
const { getSummary } = require('./controller/OrderController');


const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
}));  


app.use(bodyParser.json());

app.post('/users', addUser);
app.post('/workcells', addWorkCell); 
app.post('/status', addStatus); 
app.post('/orders', addOrder);
/* 
app.get('/', (req,res) => {
    res.send('Like and subscribe :)')

}) */

app.get('/orders', getOrders);
app.get('/summary', getSummary);



const PORT = process.env.PORT


const server = () => {
  database()

  app.listen(PORT, () => {
    console.log('listening to:', PORT)
  })

}

server()



