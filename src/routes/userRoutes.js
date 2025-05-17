const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser); // Register a new user
router.post('/login',userController.loginUser);   // User login
router.post('/profile',authMiddleware,userController.fetchProfile);  // get user profile from database
router.get('/getAllUsers',userController.getAllUsers); 
router.post('/logoutUser',authMiddleware,userController.logoutUser);// getAllUsers from Database

module.exports = router;

