const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users/User");
const config = require("../config/config");
const CustomError = require("../utils/CustomError");

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
  const token = generateToken(newUser._id, newUser.email);
  newUser.token = token;
  await newUser.save();

  return newUser;
};

const loginUser = async (email, password, res) => {
  const user = await User.findOne({ email }); // Find user
  if (!user) throw new CustomError("User not found", 404);

  const isMatch = await bcrypt.compare(password, user.password); // Compare password
  if (!isMatch) throw new CustomError("Invalid credentials", 401);

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
