# AuthProwess

AuthProwess is a full-stack authentication system built with modern web technologies. It provides secure user signup, signin, password reset, and protected routes.

## Features

- User Signup and Signin
- JWT Authentication
- Password Hashing (bcrypt)
- Email-based Password Reset Flow
- Protected Routes

## Technologies

**Frontend:**
- React
- React Router
- Axios
- Tailwind CSS
- Vite

**Backend:**
- Node.js
- Express
- MongoDB (Mongoose)
- JWT
- Nodemailer (for emails)
- CORS

## Setup

To get a copy of this project up and running on your local machine, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd authProwess
    ```

2.  **Navigate to the specific parts for detailed setup:**

    - [Frontend Setup](frontend/README.md)
    - [Backend Setup](backend/README.md)

## Project Structure

```
/
├── backend/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   └── vercel.json
├── frontend/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── README.md
└── package.json (optional if using monorepo setup)
```

## Deployment

The frontend and backend are designed to be deployed separately.

- **Frontend:** Deployed on Vercel ([https://auth-prowess-8dsx.vercel.app/signin](https://auth-prowess-8dsx.vercel.app/signin))
- **Backend:** Deployed on Vercel ([https://auth-prowess.vercel.app/](https://auth-prowess.vercel.app/))

Refer to the specific READMEs for deployment details.

## Contributing

Contributions are welcome! Please see the specific frontend and backend READMEs for more details.
