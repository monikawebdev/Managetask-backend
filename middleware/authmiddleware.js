const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // 1. Check for token in cookies
        let token = req.cookies?.token;

        // 2. If no token in cookies, check Authorization header
        if (!token && req.headers.authorization) {
            // Format should be "Bearer [token]"
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7); // Extract token part
            }
        }

        // 3. If no token found, return an error
        if (!token) {
            console.warn('No token provided');
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        // 4. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 5. Attach the user ID and other details from the decoded token to the request object
        req.user = req.user || {};
        req.user.id = decoded.id;

       
        // 6. Call the next middleware or route handler
        next();
     } catch (err) {
        console.error('Error in authMiddleware:', err.message);

        // Handle specific JWT errors (e.g., token expired, invalid signature)
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token expired, please log in again' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Invalid token, authorization denied' });
        }

        // Generic error message for other cases
        res.status(401).json({ msg: 'Authorization failed' });
    }
};

module.exports = authMiddleware;