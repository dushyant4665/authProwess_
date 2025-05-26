# AuthProwess Backend

This is the backend application for AuthProwess, a full-stack authentication system built with Node.js, Express, and MongoDB.

## Table of Contents

- [Technologies](#technologies)
- [Setup](#setup)
- [Running Locally](#running-locally)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)

## Technologies

- Node.js: JavaScript runtime environment
- Express: Fast, unopinionated, minimalist web framework for Node.js
- MongoDB: NoSQL database
- Mongoose: MongoDB object modeling for Node.js
- JWT: JSON Web Tokens for authentication
- bcrypt: Library to help you hash passwords
- Nodemailer: Module to send emails with Node.js
- CORS: Node.js package for providing a Connect/Express middleware that can be used to enable CORS

## Setup

Navigate to the `backend` directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

## Running Locally

1.  **Set up environment variables:**

    Create a `.env` file in the `backend` directory based on `.env.example` (you'll need to create `.env.example` as well).

    ```dotenv
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    EMAIL_USER=your_gmail@gmail.com
    EMAIL_PASS=your_gmail_app_password
    FRONTEND_URL=http://localhost:5173
    ```

    *Note: For `MONGODB_URI`, you can use a local MongoDB instance or a cloud service like MongoDB Atlas.*
    *Note: For `EMAIL_USER` and `EMAIL_PASS`, you'll need to set up a Gmail account and generate an App Password for sending password reset emails.*

2.  **Start the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

The server will run on the specified PORT (default is 5000).

## Environment Variables

- `PORT`: The port the server will listen on (default: 5000).
- `MONGODB_URI`: Your MongoDB connection string.
- `JWT_SECRET`: A strong, unique secret key for signing JWTs.
- `EMAIL_USER`: Your Gmail address for sending emails.
- `EMAIL_PASS`: Your Gmail App Password.
- `FRONTEND_URL`: The URL of your frontend application (for CORS and password reset links).

## API Endpoints

The API endpoints are prefixed with `/api/auth`.

### Authentication

- `POST /api/auth/signup` - Register a new user.
  - **Request Body:** `{ "email": "string", "password": "string" }`
  - **Response:** `{ "token": "string", "email": "string" }`

- `POST /api/auth/signin` - Sign in an existing user.
  - **Request Body:** `{ "email": "string", "password": "string" }`
  - **Response:** `{ "token": "string", "email": "string" }`

- `POST /api/auth/forgot-password` - Request a password reset email.
  - **Request Body:** `{ "email": "string" }`
  - **Response:** `{ "message": "string" }`

- `POST /api/auth/reset-password/:token` - Reset password using a token.
  - **URL Parameters:** `:token` (reset token from email link)
  - **Request Body:** `{ "password": "string" }`
  - **Response:** `{ "message": "string" }`

## Deployment

This backend is deployed on Vercel. To deploy your own instance:

1.  **Link your Git repository to Vercel.**
2.  **Configure build settings:** Ensure Vercel uses `@vercel/node` for the `server.js` file.
3.  **Set up `vercel.json`:** Make sure the `vercel.json` file is in the root of your backend directory with the correct routing configuration (as created previously).
4.  **Set up environment variables:** In your Vercel project settings, add all necessary environment variables (`PORT`, `MONGODB_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`, `FRONTEND_URL`).
5.  **Deploy:** Vercel will automatically build and deploy your application on every push to the connected branch.

---

[Back to Root README](../README.md) 