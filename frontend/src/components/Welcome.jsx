import { useAuth } from '../context/AuthContext';

const Welcome = () => {
  const { user, signout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Welcome to AuthProwess
          </h1>
          <p className="mt-5 text-xl text-gray-300">
            A secure and modern authentication system
          </p>
        </div>

        <div className="mt-12 bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              About This Project
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                AuthProwess is a full-stack authentication system built with modern
                technologies:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>React.js for the frontend with a beautiful, responsive UI</li>
                <li>Node.js and Express for the backend API</li>
                <li>MongoDB for secure data storage</li>
                <li>JWT for secure authentication</li>
                <li>Password hashing with bcrypt</li>
                <li>Email-based password reset functionality</li>
              </ul>
              <p>
                This project demonstrates best practices in authentication,
                including:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Secure password storage and validation</li>
                <li>Protected routes and API endpoints</li>
                <li>Token-based authentication</li>
                <li>Password reset flow with email verification</li>
                <li>Responsive and user-friendly interface</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-300 mb-4">
            Signed in as: <span className="text-blue-400">{user.email}</span>
          </p>
          <button
            onClick={signout}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome; 