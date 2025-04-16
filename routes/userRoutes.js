const express = require('express');
const { registerUser, loginUser, protectedCheck, getProfile, logout } = require('../controllers/userController');

const router = express.Router();

// Define the route for registering a user
router.post('/register', registerUser);
router.post('/login', loginUser); // Changed the route to '/login'
router.post('/protectedCheck', protectedCheck);
router.post('/getProfile', getProfile);
router.post('/logout', logout);

module.exports = router;