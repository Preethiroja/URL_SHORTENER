const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  // 💡 THE CHIEF FIX: Add bio and avatar here so Mongoose allows saving them!
  bio: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: '🦊'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);