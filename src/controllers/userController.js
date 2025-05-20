const User = require("../models/users/User");
const bcrypt = require("bcryptjs");
const sendResponse = require("../utils/responseHelper");
const jwt = require("jsonwebtoken");
const authService = require('../services/userService')
const _ = require('lodash')


// Register a new user
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, countryCode, password } = req.body;

    if(_.isEmpty(firstName))
      return sendResponse(res, 200, "FirstName should not be empty or null");


    if(_.isEmpty(lastName))
      return sendResponse(res, 200, "LastName should not be empty or null");

    if(_.isEmpty(email))
      return sendResponse(res, 200, "Email should not be empty or null");

    if(_.isEmpty(phoneNumber))
      return sendResponse(res, 200, "PhoneNumber should not be empty or null");

    if(_.isEmpty(countryCode))
      return sendResponse(res, 200, "CountryCode should not be empty or null");

    if(_.isEmpty(password))
      return sendResponse(res, 200, "Password should not be empty or null");

    const newUser = await authService.registerUser({firstName,lastName,email,phoneNumber,countryCode,password});
    return sendResponse(res, 200, "User registered successfully", newUser);
  } catch (err) {

    const statusCode = err.statusCode || 500;
    sendResponse(res, statusCode, { message: err.message || "Internal server error" });
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
     const statusCode = err.statusCode || 500;
    return sendResponse(res, statusCode, { message: err.message || "Internal server error" });
  }
};

const fetchProfile = async (req, res) => {
  try {
    const { _id } = req.body;
    const user = await authService.fetchProfile(_id);
    return sendResponse(res, 200, "Profile fetched successfully", user);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return sendResponse(res, statusCode, { message: err.message || "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {

    const filters = req.query;
    const allUsers = await authService.getAllUsers(filters)
    return sendResponse(res, 200, "Users data fetched successfully", allUsers);
    
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return sendResponse(res, statusCode, { message: err.message || "Internal server error" });
  }
};

const logoutUser = async (req, res) => {
  try {

    const { userId } = req.body;
    const user = await authService.logoutUser(userId);
    return sendResponse(res, 200, "Logout successful", user);

  } catch (err) {
    const statusCode = err.statusCode || 500;
    return sendResponse(res, statusCode, { message: err.message || "Internal server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  fetchProfile,
  getAllUsers,
  logoutUser,
};
