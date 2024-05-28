const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const{mongoose} = require('mongoose');

//database
mongoose
.connect(process.env.MONGO_URL)
.then(() => console.log('Connected to MongoDB'))
.catch((err)=> console.log("DB not connected"));

app.use(cors());

app.get('/', (req,res) => {
    res.send('Like and subscribe :)')

})

app.listen(8000, () => {
    console.log('Server is listening on http://localhost:8000');

})

