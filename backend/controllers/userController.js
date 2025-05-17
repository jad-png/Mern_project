const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
    try {
        const { email, password, username } = req.body;
        const user = new User({ email, password, username, role: 'Client' });
        await user.save();
        res.status(201).json({ userId: user._id });
    } catch (err) {
        next(err);
    }
};