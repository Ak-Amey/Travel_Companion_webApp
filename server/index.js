const express = require('express');
const connectToMongo = require('./db');
const cors = require('cors');
require('dotenv').config();

connectToMongo();

const app = express();
app.use(cors());
app.use(express.json()); //middleware

//Available Routes
app.use('/api/auth', require('./routes/auth'));

app.listen(process.env.PORT, () => {
    console.log('listening on port 5000');
})