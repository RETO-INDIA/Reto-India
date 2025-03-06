import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react'; // Import Lottie for animations
import animationData from '../Resource/Animation.json'; // Replace with your animation file
import companyLogo from "../img/logo.png"; // Replace with your company logo

import { handleError, handleSuccess } from '../utils';

const Signup = () => {
  const [user, setUser] = useState({
    fullname: '',
    email: '',
    password: '',
    phoneNo: '', // Add phoneNo to the state
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user);

    const { fullname, email, password, phoneNo } = user;

    // Validate all fields including phoneNo
    if (!fullname || !email || !password || !phoneNo) {
      return handleError('All fields are required');
    }

    try {
      const url = 'https://reto-india-admin-backend.onrender.com/auth/signup';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user), 
      });

      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else if (error) {
        const details = error?.details[0]?.message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='flex w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden'>
        <div
          className='hidden md:flex md:w-1/2 items-center justify-center p-8'
          style={{
            background: 'linear-gradient(106.737deg, #FFD8A8 29.63%, #FFC078 51.55%, #f3b675 90.85%)',
          }}
        >
          <Lottie animationData={animationData} loop={true} />
        </div>

        {/* Right Side: Signup Form */}
        <div className='w-full md:w-1/2 p-8 space-y-6'>
          <div className='flex justify-center'>
            <img src={companyLogo} alt='Company Logo' className='h-16' /> {/* Replace with your logo */}
          </div>
          <h1 className='text-2xl font-bold text-center text-gray-900'>Signup</h1>

          <form className='space-y-6' onSubmit={handleSubmit}>
            <div>
              <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                Name
              </label>
              <input
                type='text'
                name='fullname'
                placeholder='Enter Your Name'
                value={user.fullname}
                onChange={handleChange}
                className='w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>

            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                Email
              </label>
              <input
                type='email'
                name='email'
                placeholder='Enter Your Email'
                value={user.email}
                onChange={handleChange}
                className='w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                Password
              </label>
              <input
                type='password'
                name='password'
                placeholder='Enter Your Password'
                value={user.password}
                onChange={handleChange}
                className='w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>

            <div>
              <label htmlFor='phoneNo' className='block text-sm font-medium text-gray-700'>
                Phone Number
              </label>
              <input
                type='text'
                name='phoneNo'
                placeholder='Enter Your Phone Number'
                value={user.phoneNo}
                onChange={handleChange}
                className='w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>

            <button
              type='submit'
              className='w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              Signup
            </button>

            <div className='text-sm text-center text-gray-600'>
              <span>Already have an account? </span>
              <Link to='/login' className='font-medium text-blue-600 hover:text-blue-500'>
                Login
              </Link>
            </div>
          </form>

          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Signup;