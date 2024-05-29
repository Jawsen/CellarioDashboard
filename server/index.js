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

const app = express();


app.use(bodyParser.json());

app.post('/users', addUser);
app.post('/workcells', addWorkCell); 
app.post('/status', addStatus); 
app.post('/orders', addOrder);

app.get('/', (req,res) => {
    res.send('Like and subscribe :)')

})


const PORT = process.env.PORT


const server = () => {
  database()

  app.listen(PORT, () => {
    console.log('listening to:', PORT)
  })

}

server()



