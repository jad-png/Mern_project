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

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (user.isBanned) {
            return res.status(403).json({ message: 'This user is banned' });
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token }); 
    } catch (err) {
        next(err);
    }
};

const listUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, { password: 0 });
        res.json(users);
    } catch (err) {
        next(err);
    }
};

const banUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndUpdate(userId, { isBanned: true });
        res.json({ message: 'User banned successfully' });
    } catch (err) {
        next(err);
    }
};

const unBanUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndUpdate(userId, { isBanned: false });
        res.json({ message: 'User unbanned successfully' });
    } catch (err) {
        next(err);
    }
};

const updateRole = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        if (!['Client', 'Coach'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }
        await User.findByIdAndUpdate(userId, { role });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login, listUsers, banUser, unBanUser, updateRole };