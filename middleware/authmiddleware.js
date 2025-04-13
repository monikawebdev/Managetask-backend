const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Check if cookies exist and retrieve the token
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Initialize req.user if it doesn't exist and assign the user ID
        req.user = req.user || {};
        req.user.id = decoded.id;

        next();
    } catch (err) {
        // Handle invalid or expired tokens
        res.status(401).json({ msg: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;