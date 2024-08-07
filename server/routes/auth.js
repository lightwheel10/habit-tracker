const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');

router.post('/login', async (req, res) => {
  console.log('Login attempt received');
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ msg: 'Please provide both email and password' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Invalid password for user: ${email}`);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign tokens
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // Update user's refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    console.log(`User logged in successfully: ${email}`);

    // Send tokens in response
    res.json({
      msg: 'Login successful',
      accessToken,
      refreshToken
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error during login' });
  }
});

// In auth.js
router.post('/register', async (req, res) => {
  console.log('Registration attempt received');
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      username,
      email: email.toLowerCase(),
      password
    });

    await user.save();

    const payload = { user: { id: user.id } };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    res.status(201).json({ msg: 'User registered successfully', accessToken, refreshToken });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error during registration' });
  }
});

module.exports = router;