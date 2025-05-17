const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticate = (roles = []) => async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if(!user) {
            return res.status(401).json({ message: 'Invalid token'});
        }
        if(user.isBanned) {
            return res.status(403).json({ message: 'User is banned'});
        }
        if(roles.length && !roles.includes(user.role)) {
            return res.status(403).json({ message: 'Unauthorized role'});
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token'});
    }
};

module.exports = { authenticate };