const User = require("../models/users/User");
const bcrypt = require("bcryptjs");
const sendResponse = require("../utils/responseHelper");
const jwt = require("jsonwebtoken");

const generateToken = (userId, email) => {
  return jwt.sign({ id: userId, email: email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, countryCode, password } =
      req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      countryCode,
      password: hashedPassword,
    });
    const token = generateToken(newUser._id, newUser.email);
    newUser.token = token;
    await newUser.save();

    return sendResponse(res, 200, "User registered successfully", newUser);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); // Find user
    if (!user) return sendResponse(res, 404, "User not found");
    const isMatch = await bcrypt.compare(password, user.password); // Compare password
    if (!isMatch) return sendResponse(res, 401, "Invalid credentials");
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
