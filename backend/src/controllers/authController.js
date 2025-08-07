const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config');

const signToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

exports.signup = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const user = await User.create({ email, password });
  const token = signToken(user._id);
  res.status(201).json({ success: true, message: 'Signup successful', data: { token, user: { id: user._id, email: user.email } } });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }
  const token = signToken(user._id);
  res.json({ success: true, message: 'Login successful', data: { token, user: { id: user._id, email: user.email } } });
});
