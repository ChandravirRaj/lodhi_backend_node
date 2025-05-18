const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users/User");
const config = require("../config/config");
const CustomError = require("../utils/CustomError")

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
  if (!user) return sendResponse(res, 404, "User not found");

  const isMatch = await bcrypt.compare(password, user.password); // Compare password
  if (!isMatch) return sendResponse(res, 401, "Invalid credentials");

  return user;
};



const fetchProfile = async (userId) => {
  const user = await User.findOne({ _id: userId }); // Find user
  if (!user) throw new CustomError("User not found",404);
  return user;
};



module.exports = {
  registerUser,
  loginUser,
  fetchProfile,
};
