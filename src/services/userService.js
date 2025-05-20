const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users/User");
const CustomError = require("../utils/CustomError");
// const generateToken = require('../utils/Utils');

const generateToken = (userId, email) => {
  return jwt.sign({ id: userId, email: email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const registerUser = async ({
  firstName,
  lastName,
  email,
  phoneNumber,
  countryCode,
  password,
}) => {
  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("User already exists");
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
  await newUser.save();
  return newUser;
};


const loginUser = async (email, password) => {
  const user = await User.findOne({ email }); // Find user
  if (!user) throw new CustomError("User not found", 404);

  const isMatch = await bcrypt.compare(password, user.password); // Compare password
  if (!isMatch) throw new CustomError("Invalid credentials", 401);

  const token = generateToken(user._id, user.email);
  user.token = token;
  await user.save();

  return user;
};


const fetchProfile = async (userId) => {
  const user = await User.findOne({ _id: userId }); // Find user
  if (!user) throw new CustomError("User not found", 404);
  return user;
};


const getAllUsers = async (query) => {
  const allUsers = await User.find(query);
  if (!allUsers) throw new CustomError("No data found", 404);
  return allUsers;
};



const logoutUser = async (userId) => {

    const user = await User.findById(userId);
    if (!user) throw new CustomError("User not found", 404);

    user.token = null; // or `""`
    await user.save();

    return user;
};


module.exports = {
  registerUser,
  loginUser,
  fetchProfile,
  getAllUsers,
  logoutUser
};
