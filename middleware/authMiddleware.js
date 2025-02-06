const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model

exports.protect = async (req, res, next) => {
    let token;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret

            // Attach user to request
            req.user = await User.findByPk(decoded.id); // Assuming your token has user ID
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
