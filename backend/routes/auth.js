import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendResetEmail } from '../utils/email.js';

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({ email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Signin route
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      // Return success even if user not found for security
      return res.json({ message: 'If an account exists, a password reset email will be sent' });
    }

    try {
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
      user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
      
      await user.save();

      // Send email
      await sendResetEmail(email, resetToken);
      
      res.json({ message: 'If an account exists, a password reset email will be sent' });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Reset the token if email sending fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      
      // Still return success for security
      res.json({ message: 'If an account exists, a password reset email will be sent' });
    }
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ 
      message: 'An error occurred while processing your request. Please try again later.' 
    });
  }
});

// Reset password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 