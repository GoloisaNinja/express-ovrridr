const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();
const db = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(db, {});
        console.log('MongoDB connected...');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;