const express = require('express');
const connectToMongo = require('./db');
const cors = require('cors');
require('dotenv').config();
const path=require('path');

connectToMongo();

const app = express();
app.use(cors());
app.use(express.json()); //middleware

//Available Routes
app.use('/api/auth', require('./routes/auth'));

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*',function(req,res){
    res.sendFile(path.join(__dirname,'/client/build/index.html'));
})

app.listen(process.env.PORT, () => {
    console.log('listening on port 5000');
})