const mongoose = require('mongoose');
const connectDB = async (uri) => {
    try {
      const conn = await mongoose.connect(uri);      // Use the MONGO_URI from .env file
      console.log(`MongoDB is connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`MongoDB connection failed: ${error.message}`);
      process.exit(1); // Exit process with failure
    }
  };


module.exports = connectDB;
