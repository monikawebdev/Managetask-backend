const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Utility function to create JWT tokens
const createToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register User
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error in registerUser:', err); // Log the full error
        res.status(500).json('Error in registerUser:', err);
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = createToken(user);

        // Set token in a cookie
        const cookieOptions = { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
        };
        res.cookie('token', token, cookieOptions);

        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error('Error in loginUser:', err); // Log the full error
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
};   


exports.logout = async (req, res) => {
    // res.cookie('token', '', { httpOnly: true, maxAge: 1 });
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None'
    });
    res.status(200).json({ msg: 'Logged out successfully' });
  };
  
  exports.protectedCheck = async (req,res) => {
    try{
      if (req.user) {
        res.status(200).json({ message: "Authenticated",
          _id: req._id, 
      });
      }else{
        res.status(401).json({msg:"Unauthorised"});
      }
    }catch(err){
      res.status(500).json({ error: `Error: ${err.message}` });
    }
  }
  
  exports.getProfile = async (req, res) => {
    try {
        const userProfile = await User.findOne({ _id: req.user }).select('-password -__v -_id');
        if (!userProfile) {
            return res.status(404).json({ error: 'No user found' });
        }
        res.json(userProfile);
    } catch (err) {
        res.status(500).json({ error: `Error: ${err.message}` });
    }
  }