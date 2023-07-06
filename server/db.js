const mongoose = require('mongoose');
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;

const connectToMongo = async() =>{
    try{
        mongoose.connect(mongoURI);
        console.log('Connected to MongoDb');
    }
    catch(e){
        console.error(e);
    }
} 

module.exports = connectToMongo;