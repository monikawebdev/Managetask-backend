const express = require('express');
const { registerUser,loginUser,protectedCheck,getProfile,logout } = require('../controllers/userController'); // Import registerUser from authController

const router = express.Router();

// Define the route for registering a user
router.post('/register', registerUser);
router.post('/login/email', loginUser);
router.post('/protectedCheck', protectedCheck);
router.post('/getProfile', getProfile);
router.post('/logout', logout);



module.exports = router;