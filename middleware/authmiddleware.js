const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Token extraction
        let token = req.cookies?.token;
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            console.warn('[authMiddleware] No token provided');
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = req.user || {};
        req.user.id = decoded.id; // Attach user ID

        console.log('[authMiddleware] Authenticated User ID:', req.user.id); // Debug log
        next();
    } catch (err) {
        console.error('[authMiddleware] Error:', err.message);
        res.status(401).json({ msg: 'Authorization failed' });
    }
};

module.exports = authMiddleware;