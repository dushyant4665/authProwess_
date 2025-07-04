# AuthProwess - Secure Authentication System

A modern, production-ready authentication system built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Features include secure user registration, login, password reset via email, and protected routes.

## 🌟 Features

- **User Authentication**
  - Secure signup and login
  - JWT-based session management
  - Password reset via email
  - Protected routes
  - Secure password storage with bcrypt

- **Modern UI/UX**
  - Responsive design
  - Clean, intuitive interface
  - Loading states and error handling
  - Form validation
  - Toast notifications

- **Security**
  - Password hashing
  - JWT token authentication
  - Secure password reset flow
  - Environment variable protection
  - Rate limiting (production)
  - CORS protection

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Gmail account (for password reset emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/authprowess.git
   cd authprowess
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**

   Create `.env` files in both backend and frontend directories:

   Backend `.env`:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_gmail_app_password
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=production
   ```

   Frontend `.env`:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. **Gmail Setup (for password reset)**
   - Enable 2-Step Verification in your Google Account
   - Generate an App Password:
     1. Go to Google Account → Security
     2. Under "2-Step Verification", click "App passwords"
     3. Select "Mail" and "Other (Custom name)"
     4. Name it "AuthProwess"
     5. Copy the 16-digit password
   - Use this App Password in your backend `.env` file

### Development

1. **Start MongoDB**
   ```bash
   # Start MongoDB service
   mongod
   ```

2. **Run the development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

   Access the application at:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🏗️ Production Deployment

### Backend Deployment (Node.js/Express)

1. **Prepare for production**
   ```bash
   cd backend
   npm run build
   ```

2. **Environment Variables**
   - Set `NODE_ENV=production`
   - Use production MongoDB URI
   - Update `FRONTEND_URL` to your production domain
   - Ensure all secrets are properly set

3. **Deployment Options**
   - **Heroku**: Use Procfile
   - **DigitalOcean**: Use App Platform
   - **AWS**: Use Elastic Beanstalk
   - **Vercel**: Use serverless functions

### Frontend Deployment (React)

1. **Build for production**
   ```bash
   cd frontend
   npm run build
   ```

2. **Update Environment**
   - Set `VITE_API_URL` to your production backend URL

3. **Deployment Options**
   - **Vercel**: Automatic deployment
   - **Netlify**: Drag and drop build folder
   - **AWS S3**: Static website hosting
   - **Firebase**: Hosting service

### MongoDB Setup

1. **Production Database**
   - Use MongoDB Atlas for production
   - Set up proper network access rules
   - Configure database user with limited permissions
   - Enable database backups

2. **Connection String**
   - Use the MongoDB Atlas connection string
   - Include username and password
   - Add retryWrites=true
   - Set proper read/write preferences

## 🔒 Security Checklist

- [ ] All environment variables are set
- [ ] JWT secret is strong and unique
- [ ] MongoDB connection is secure
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] SSL/TLS is configured
- [ ] Password reset emails are working
- [ ] Error messages are sanitized
- [ ] Input validation is in place
- [ ] Dependencies are up to date

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Protected Routes
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

## 🛠️ Maintenance

### Regular Tasks
1. **Security Updates**
   ```bash
   # Check for outdated packages
   npm audit
   npm outdated

   # Update dependencies
   npm update
   ```

2. **Database Maintenance**
   - Monitor database size
   - Check connection pool
   - Review indexes
   - Backup data regularly

3. **Log Monitoring**
   - Check error logs
   - Monitor authentication attempts
   - Review password reset requests

### Troubleshooting

1. **Email Issues**
   - Verify Gmail App Password
   - Check email service limits
   - Review SMTP logs

2. **Authentication Problems**
   - Verify JWT secret
   - Check token expiration
   - Review user sessions

3. **Database Connection**
   - Verify connection string
   - Check network access
   - Monitor connection pool

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Node.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [React Production Build](https://create-react-app.dev/docs/production-build/)
- [JWT Security Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Gmail for email service
- All open-source contributors
