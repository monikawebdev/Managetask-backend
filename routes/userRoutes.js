const express = require('express');
const { registerUser,loginUser } = require('../controllers/userController'); // Import registerUser from authController

const router = express.Router();

// Define the route for registering a user
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;