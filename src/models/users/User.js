
const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,   // Trims spaces
  },
  lastName: {
    type: String,
    required: true,
    trim: true,   // Trims spaces
  },
  
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email is unique
    lowercase: true, // Makes email lowercase
    match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Please fill a valid email address'], // Validates email format
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: true, // Ensures phoneNumber is unique
  },
  countryCode: {
    type: Number,
    required: true,
    unique: true, // Ensures countryCode is unique
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum length of password
    // select: false
  },

  token: {
    type: String,
    default: null, 
    minlength: 6, // Minimum length of password
    // select: false
  },

  isActive:{
    type:Boolean,
    default: true
  }
}, { timestamps: true }); // Automatically adds `createdAt` and `updatedAt` fields



// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
