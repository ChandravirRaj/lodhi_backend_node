const User = require("../models/users/User");
const bcrypt = require("bcryptjs");
const sendResponse = require("../utils/responseHelper");
const jwt = require("jsonwebtoken");
const authService = require('../services/userService')
const _ = require('lodash')

const generateToken = (userId, email) => {
  return jwt.sign({ id: userId, email: email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, countryCode, password } = req.body;

    if(_.isEmpty(firstName))
      return sendResponse(res, 200, "firstName should not be empty or null");


    if(_.isEmpty(lastName))
      return sendResponse(res, 200, "lastName should not be empty or null");

    if(_.isEmpty(email))
      return sendResponse(res, 200, "Email should not be empty or null");

    if(_.isEmpty(phoneNumber))
      return sendResponse(res, 200, "phoneNumber should not be empty or null");

    if(_.isEmpty(countryCode))
      return sendResponse(res, 200, "countryCode should not be empty or null");

    if(_.isEmpty(password))
      return sendResponse(res, 200, "password should not be empty or null");

    const newUser = await authService.registerUser({firstName,lastName,email,phoneNumber,countryCode,password},res);
    return sendResponse(res, 200, "User registered successfully", newUser);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if(_.isEmpty(email))
      return sendResponse(res, 200, "Email should not be empty or null");

    if(_.isEmpty(password))
      return sendResponse(res, 200, "Password should not be empty or null");

    const user = await authService.loginUser(email,password,res);
    return sendResponse(res, 200, "Login successful", user);
  } catch (err) {
    return sendResponse(res, 200, err.message);
  }
};

const fetchProfile = async (req, res) => {
  try {
    const { _id } = req.body;
    const user = await User.findOne({ _id: _id }); // Find user
    if (!user) return sendResponse(res, 404, "User not found");
    return sendResponse(res, 200, "Profile fetched successfully", user);
  } catch (err) {
    return sendResponse(res, 500, err.message);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const filters = req.query;
    const allUsers = await User.find(filters);
    if (!allUsers) sendResponse(res, 404, "No data found");
    return sendResponse(res, 200, "Users data fetched successfully", allUsers);
  } catch (err) {
    return sendResponse(res, 500, err.message);
  }
};

const logoutUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) sendResponse(res, 404, "User not found");

    user.token = null; // or `""`
    await user.save();

    return sendResponse(res, 200, "Logout successful", allUsers);
  } catch (err) {
    return sendResponse(res, 500, err.message);
  }
};

module.exports = {
  registerUser,
  loginUser,
  fetchProfile,
  getAllUsers,
  logoutUser,
};
