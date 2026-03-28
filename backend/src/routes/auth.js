const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// Signup Route
router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const newUser = await User.create({
      name,
      email,
      password,
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ status: 'fail', message: 'Email already exists' });
    }
    res.status(400).json({ status: 'error', message: err.message });
  }
});

// Login Route
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
    }

    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

// Get Current User (Protected)
router.get('/me', async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'You are not logged in' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({ status: 'fail', message: 'User no longer exists' });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: currentUser,
      },
    });
  } catch (err) {
    res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
});

// Update Profile (Protected)
router.put('/update-profile', async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'You are not logged in' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ status: 'fail', message: 'Please provide a name' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    res.status(401).json({ status: 'error', message: 'Invalid token or update failed' });
  }
});

module.exports = router;
