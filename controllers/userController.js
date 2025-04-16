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
        console.error('Error in registerUser:', err.message); // Log error message
        res.status(500).json({ error: 'Server error. Please try again.' });
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
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = createToken(user);

        // Set token in a cookie
        const cookieOptions = { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
        };
        res.cookie('token', token, cookieOptions);

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error in loginUser:', err.message); // Log error message
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
};

// Logout User
exports.logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None'
        });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('Error in logout:', err.message); // Log error message
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
};

// Protected Route Check
exports.protectedCheck = async (req, res) => {
    try {
        if (req.user) {
            res.status(200).json({ message: 'Authenticated', userId: req.user.id });
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (err) {
        console.error('Error in protectedCheck:', err.message); // Log error message
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
};

// Get Profile
exports.getProfile = async (req, res) => {
    try {
        const userProfile = await User.findById(req.user.id).select('-password -__v');
        if (!userProfile) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(userProfile);
    } catch (err) {
        console.error('Error in getProfile:', err.message); // Log error message
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
};