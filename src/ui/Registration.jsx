import React, { useState } from 'react';
import Login from './Login';
import Label from './Label';
import { PhotoIcon } from '@heroicons/react/16/solid';

const Registration = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleAvatar =()=>{

  }

  const handleRegistration = (e) => {
    e.preventDefault();
  
  };

  return (
    <div
     className="min-h-screen bg-black text-white pb-32"
     >
      {loggedIn ? (
        <Login />
      ) : (
        <form
          className="max-w-4xl mx-auto bg-black p-6 rounded-lg shadow-lg"
          onSubmit={handleRegistration}
        >
          <div className="border-b border-gray-950 pb-4 mb-4">
            <h2 className="text-xl font-bold uppercase tracking-wide">
              Registration Form
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Please provide the required information to register with us.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          
            <div>
              <Label title="First Name" htmlFor="firstName" />
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="Enter your first name"
                className="block w-full rounded-md border border-gray-900 bg-gray-950 py-2 px-4 text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <Label title="Last Name" htmlFor="lastName" />
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Enter your last name"
                className="block w-full rounded-md border border-gray-900 bg-gray-950 py-2 px-4 text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

   
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
                placeholder="Create a strong password"
                className="block w-full rounded-md border border-gray-900 bg-gray-950 py-2 px-4 text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
           
          </div>
          <div className='mt-2 flex items-center gap x-3'>
              <div className='flex-1'>
                <Label
                  title='Cover Photo'/>
                  <div className='mt-2 flex items-center justify-center border border-dashed py-4 px-6 rounded-lg border-white/20'>
                  <div className='text-center flex flex-col items-center'>
                  <div className='w-14 h-14 border border-gray-600 rounded-full p-1'>
                  <PhotoIcon className='mx-auto h-full w-full text-gray-500' aria-hidden='true'/>
                  </div>
                  <div className='mt-4 flex items-center mb-1 text-sm leading-6 text-gray-400'>
                  <label htmlFor='file-upload'
                  className='relative cursor-pointer rounded-md px-2 py-1 bg-gray-800 font-semibold ring-1 focus-within:ring-2 hover:bg-gray-900'>
                         <span>Upload a file</span>
                         <input
                          type='file'
                          name='file-upload'
                          id='file-upload'
                          className='sr-only'
                          onChange={handleAvatar}/>
                       </label>
                       <p className='pl-1'>or drag and drop</p>
                  </div>
                  <p>
                    PNG, JPG, GIF up to 10MB
                  </p>
                  </div>
                  <div>
                   
                  </div>
                  </div>
            
              </div>
            </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full sm:w-auto bg-indigo-500 text-white px-6 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-150"
            >
              Register
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Registration;
