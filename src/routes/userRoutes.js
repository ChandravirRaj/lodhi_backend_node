const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { registerUser, loginUser, fetchProfile, getAllUsers } = require('../controllers/userController');

router.post('/register', registerUser); // Register a new user
router.post('/login',loginUser);   // User login
router.post('/profile',authMiddleware,fetchProfile);  // get user profile from database
router.get('/getAllUsers',getAllUsers); // getAllUsers from Database

module.exports = router;

