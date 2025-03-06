import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Lottie from 'lottie-react'; // Import Lottie for animations
import animationData from '../Resource/Animation.json'; // Replace with your animation file
import companyLogo from '../img/logo.png'; // Replace with your company logo
import { handleError, handleSuccess } from '../utils';

const Login = () => {
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = userInfo;
    if (!email || !password) {
      return handleError('All fields are required');
    }

    try {
      const url = 'https://reto-india-admin-backend.onrender.com/auth/login';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      });
      const result = await response.json();
      console.log(result);
      const { success, message, token, fullname, error } = result;
      if (success) {
        handleSuccess(message);
        localStorage.setItem('token', token);
        localStorage.setItem('loggedInUser', fullname);
        setTimeout(() => {
          navigate('/DashBoard');
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
        {/* Left Side: Animated Image with Gradient Background */}
        <div
          className='hidden md:flex md:w-1/2 items-center justify-center p-8'
          style={{
            background: 'linear-gradient(106.737deg, #FFD8A8 29.63%, #FFC078 51.55%, #f3b675 90.85%)',
          }}
        >
          <Lottie animationData={animationData} loop={true} />
        </div>

        {/* Right Side: Login Form */}
        <div className='w-full md:w-1/2 p-8 space-y-6'>
          <div className='flex justify-center'>
            <img src={companyLogo} alt='Company Logo' className='h-16' />
          </div>
          <h1 className='text-2xl font-bold text-center text-gray-900'>Login</h1>

          <form className='space-y-6' onSubmit={handleSubmit}>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                Email
              </label>
              <input
                type='email'
                name='email'
                placeholder='Enter Your Email'
                value={userInfo.email}
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
                value={userInfo.password}
                onChange={handleChange}
                className='w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>

            <button
              type='submit'
              className='w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              Login
            </button>

            <div className='text-sm text-center text-gray-600'>
              <span>Don't have an account? </span>
              <Link to='/signup' className='font-medium text-blue-600 hover:text-blue-500'>
                Signup
              </Link>
            </div>
          </form>

          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Login;