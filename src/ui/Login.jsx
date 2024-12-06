import React from 'react';
import Label from './Label';

const Login = ({ setLoggedIn }) => {
  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic (optional)
  };

  return (
    <div>
      <form
        className="max-w-4xl mx-auto bg-black p-6 rounded-lg shadow-lg"
        onSubmit={handleLogin}
      >
        <div className="border-b border-gray-950 pb-4 mb-4">
          <h2 className="text-xl font-bold uppercase tracking-wide">Sign In</h2>
          <p className="text-sm text-gray-400 mt-1">
            Provide the required information to sign in
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label title="Email Address" htmlFor="email" />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="block w-full rounded-md border border-gray-900 bg-gray-950 py-2 px-4 text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <Label title="Password" htmlFor="password" />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              className="block w-full rounded-md border border-gray-900 bg-gray-950 py-2 px-4 text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full sm:w-auto bg-indigo-500 text-white px-6 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-150"
          >
            Login
          </button>
        </div>
      </form>

      {/* Toggle to Registration */}
      <p className="text-sm leading-6 text-gray-400 text-center py-6">
        Don't have an account yet?{' '}
        <button
          onClick={() => setLoggedIn(false)}
          className="text-gray-300 font-semibold underline underline-offset-2 decoration-[1px] hover:text-white duration-200"
        >
          Register
        </button>
      </p>
    </div>
  );
};

export default Login;
