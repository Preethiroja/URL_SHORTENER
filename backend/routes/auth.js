const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // 🔐 Added for secure token generation
const nodemailer = require('nodemailer'); // 📧 Added for sending email alerts
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST api/auth/signup
// @desc    Register a user
// @access  Public
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  if (username.length < 3) {
    return res.status(400).json({ message: 'Username must be at least 3 characters' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      if (user.email === email.toLowerCase()) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
      return res.status(400).json({ message: 'Username is already taken' });
    }

    user = new User({
      username,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'supersecretjwtsecretkey12345',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio || '',
        avatar: user.avatar || '🦊'
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'supersecretjwtsecretkey12345',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio || '',
        avatar: user.avatar || '🦊'
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET api/auth/me
// @desc    Get user data
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    
    res.json({
      id: user._id, 
      username: user.username,
      email: user.email,
      bio: user.bio || '',
      avatar: user.avatar || '🦊' 
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// @route   PUT api/auth/me
// @desc    Update username, email, bio, and avatar choices
// @access  Private
router.put('/me', auth, async (req, res) => {
  const { username, email, bio, avatar } = req.body;
  if (!username) return res.status(400).json({ message: 'Username is required' });

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.username = username;
    if (email) user.email = email.toLowerCase();
    user.bio = bio || '';
    user.avatar = avatar || '🦊';

    await user.save();
    res.json({
      message: 'Profile updated successfully!',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// @route   PUT api/auth/change-password
// @desc    Change password securely
// @access  Private
router.put('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error changing password' });
  }
});

// =========================================================================
// 🔐 ADDED: PASSWORD RESET SYSTEM ENDPOINTS
// =========================================================================

// @route   POST api/auth/forgot-password
// @desc    Generate secure token and email the reset link
// @access  Public
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    
    // For security reasons, don't confirm or deny if the account exists
    if (!user) {
      return res.json({ message: 'If that email matches an account, a reset link has been sent.' });
    }

    // 1. Generate a raw random crypto string token
    const rawToken = crypto.randomBytes(20).toString('hex');

    // 2. Hash it securely before storing to protect against database-compromise leaks
    user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 Hour lifespan from now

    await user.save();

    // 3. Configure NodeMailer Transporter using your system environment variables
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // Link pointing directly back to your React Frontend layout route setup
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${rawToken}`;

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset Request',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
Please click on the following link, or paste this into your browser to complete the process within one hour:\n\n
${resetUrl}\n\n
If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'If that email matches an account, a reset link has been sent.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error sending password reset link' });
  }
});

// @route   PUT api/auth/reset-password/:token
// @desc    Verify token validity and commit new password update
// @access  Public
router.put('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    // Hash the incoming URL param token to check against database records
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // Find user where token matches and current timestamp is less than expiration timestamp
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Reset token is invalid or has expired.' });
    }

    // Hash and save the new password string
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clean up temporary token properties from user document completely
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ message: 'Password successfully updated! You can now log in.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating password' });
  }
});

module.exports = router;