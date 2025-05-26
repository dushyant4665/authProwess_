import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  // Add indexes for better query performance
  indexes: [
    { email: 1 },
    { resetPasswordToken: 1, resetPasswordExpire: 1 }
  ]
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) return next();
    
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// Add error handling for duplicate email
userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Email already registered'));
  } else {
    next(error);
  }
});

// Add static method to find user by email with timeout and retry
userSchema.statics.findByEmail = async function(email, maxRetries = 3) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      // Check connection state
      if (mongoose.connection.readyState !== 1) {
        throw new Error('Database not connected');
      }

      const user = await this.findOne({ email })
        .select('+password')
        .maxTimeMS(15000) // Increased timeout
        .lean(); // Use lean queries for better performance

      return user;
    } catch (error) {
      console.error(`User lookup attempt ${i + 1} failed:`, error);
      lastError = error;
      
      // If it's a timeout error, wait before retrying
      if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        continue;
      }
      
      // For other errors, throw immediately
      throw error;
    }
  }
  
  throw lastError || new Error('Failed to find user after multiple attempts');
};

// Add static method for finding user with reset token
userSchema.statics.findByResetToken = async function(token, maxRetries = 3) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      if (mongoose.connection.readyState !== 1) {
        throw new Error('Database not connected');
      }

      const user = await this.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() }
      })
        .maxTimeMS(15000)
        .lean();

      return user;
    } catch (error) {
      console.error(`Reset token lookup attempt ${i + 1} failed:`, error);
      lastError = error;
      
      if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError || new Error('Failed to find user with reset token after multiple attempts');
};

const User = mongoose.model('User', userSchema);

// Add connection error handling
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

export default User;