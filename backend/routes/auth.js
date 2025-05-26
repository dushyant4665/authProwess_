import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendResetEmail } from '../utils/email.js';
import validator from 'validator';
import bcrypt from 'bcrypt';

const router = express.Router();

// Input validation middleware
const validateSignupInput = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  next();
};

// Signup route
router.post('/signup', validateSignupInput, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user already exists using the improved method
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    const user = await User.create({ email, password });
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      email: user.email,
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.message.includes('Database not connected')) {
      return res.status(503).json({ message: 'Service temporarily unavailable. Please try again.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating account' });
  }
});

// Signin route
router.post('/signin', validateSignupInput, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user using the improved method
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      email: user.email,
      message: 'Signed in successfully'
    });
  } catch (error) {
    console.error('Signin error:', error);
    if (error.message.includes('Database not connected')) {
      return res.status(503).json({ message: 'Service temporarily unavailable. Please try again.' });
    }
    res.status(500).json({ message: 'Error signing in' });
  }
});

// Request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not
      return res.json({ message: 'If your email is registered, you will receive a password reset link' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Update user with reset token
    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: hashedToken,
      resetPasswordExpire: Date.now() + 10 * 60 * 1000 // 10 minutes
    }, { maxTimeMS: 15000 });

    try {
      await sendResetEmail(email, resetToken);
      res.json({ message: 'If your email is registered, you will receive a password reset link' });
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Reset the token if email fails
      await User.findByIdAndUpdate(user._id, {
        resetPasswordToken: undefined,
        resetPasswordExpire: undefined
      }, { maxTimeMS: 15000 });
      throw new Error('Failed to send reset email');
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    if (error.message.includes('Database not connected')) {
      return res.status(503).json({ message: 'Service temporarily unavailable. Please try again.' });
    }
    res.status(500).json({ message: 'Error processing password reset request' });
  }
});

// Reset password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findByResetToken(hashedToken);
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password and clear reset token
    await User.findByIdAndUpdate(user._id, {
      password,
      resetPasswordToken: undefined,
      resetPasswordExpire: undefined
    }, { maxTimeMS: 15000 });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    if (error.message.includes('Database not connected')) {
      return res.status(503).json({ message: 'Service temporarily unavailable. Please try again.' });
    }
    res.status(500).json({ message: 'Error resetting password' });
  }
});

export default router;