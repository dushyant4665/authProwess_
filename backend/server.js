import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

// Load environment variables
dotenv.config();

// Verify critical environment variables
const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASS', 'MONGODB_URI', 'JWT_SECRET', 'FRONTEND_URL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// Log email configuration (without password)
console.log('Email configuration:', {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS ? '***' : 'missing'
});

const app = express();

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  next();
});

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
  'https://auth-prowess.vercel.app',
  // GitHub Codespaces specific origins
  'https://glorious-yodel-x5564r4x7wr5h6r4g-5173.app.github.dev',
  /^https:\/\/[a-zA-Z0-9-]+-[0-9]+\.app\.github\.dev$/,
  /^https:\/\/[a-zA-Z0-9-]+-[0-9]+\.github\.dev$/
].filter(Boolean);

console.log('Server starting with allowed origins:', allowedOrigins);

// Basic CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log('Request origin:', origin);
  
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  }
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    res.setHeader('Access-Control-Max-Age', '600');
    return res.status(204).end();
  }
  
  next();
});

// Then use the cors middleware
app.use(cors({
  origin: function(origin, callback) {
    console.log('CORS middleware checking origin:', origin);
    
    if (!origin) {
      console.log('No origin, allowing request');
      return callback(null, true);
    }
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) {
        const matches = allowedOrigin.test(origin);
        console.log(`Testing ${origin} against regex ${allowedOrigin}: ${matches}`);
        return matches;
      }
      const matches = allowedOrigin === origin;
      console.log(`Testing ${origin} against ${allowedOrigin}: ${matches}`);
      return matches;
    });

    if (!isAllowed) {
      console.log('Origin not allowed:', origin);
      return callback(new Error('CORS not allowed'), false);
    }

    console.log('Origin allowed:', origin);
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600
}));

app.use(express.json());

// Root route
app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.json({
    status: 'ok',
    message: 'AuthProwess API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      health: '/api/health'
    },
    cors: {
      allowedOrigins: allowedOrigins
    }
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  console.log('Health check accessed');
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    cors: {
      allowedOrigins: allowedOrigins
    }
  });
});

// API routes
app.use('/api/auth', authRoutes);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'API endpoint not found'
  });
});

// Catch-all route for non-API routes
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// MongoDB Connection with retry logic
const connectDB = async () => {
  const maxRetries = 5;
  let retryCount = 0;

  const connectWithRetry = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 30000, // Increased from 5000 to 30000
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000, // Added explicit connect timeout
        maxPoolSize: 10, // Limit connection pool size
        minPoolSize: 5, // Maintain minimum connections
        retryWrites: true,
        retryReads: true,
        w: 'majority', // Write concern
        wtimeoutMS: 25000, // Write timeout
        heartbeatFrequencyMS: 10000, // Check connection health more frequently
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);
      retryCount = 0; // Reset retry count on successful connection
    } catch (error) {
      console.error('MongoDB connection error:', error);
      retryCount++;

      if (retryCount < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff with max 30s
        console.log(`Retrying connection in ${delay/1000} seconds... (Attempt ${retryCount}/${maxRetries})`);
        setTimeout(connectWithRetry, delay);
      } else {
        console.error('Max retry attempts reached. Please check your MongoDB connection settings.');
        process.exit(1); // Exit if we can't connect after max retries
      }
    }
  };

  await connectWithRetry();
};

// Connect to MongoDB
connectDB();

// Add more robust error handling for MongoDB
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  // Attempt to reconnect on error
  if (mongoose.connection.readyState === 0) {
    connectDB();
  }
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
  connectDB();
});

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during MongoDB disconnection:', err);
    process.exit(1);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle CORS errors
  if (err.name === 'CORSError') {
    return res.status(403).json({
      status: 'error',
      message: 'CORS error: ' + err.message
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't crash the server, just log the error
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 