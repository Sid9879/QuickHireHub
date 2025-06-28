import React, { useState, useRef, useEffect } from 'react';
import google from '../assets/google.png';
import {useNavigate} from 'react-router-dom'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/userSlice';


const Login = () => {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [theme, setTheme] = useState('light');
  const cardRef = useRef(null);


  const getUserProfile = async () => {
  try {
    let response = await axios.get(`https://freelancing-backend-z0fy.onrender.com/api/auth/getUser`, {
      withCredentials: true,
    });
    const user = response.data.user;
    dispatch(loginUser(user));
  } catch (error) {
    console.error("Failed to get user profile:", error);
  }
};

  const handleSubmit = async(e)=>{
e.preventDefault()
const userData = {email,password}
try {
  let res = await axios.post(`https://freelancing-backend-z0fy.onrender.com/api/auth/login`,userData,{
   withCredentials: true
})
let data = res.data;
if(data.success){
         toast.success(data.message,{position:"top-center",theme:"dark"})
    await getUserProfile();
        navigate('/')
      }
} catch (error) {
       toast.error(error.response?.data?.error || error.response?.data?.message || "Login failed",{position:"top-center",theme:"dark"})
  
}
  }
    

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // Mouse x inside card
    const y = e.clientY - rect.top;  // Mouse y inside card

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(800px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    card.style.transform = `perspective(800px) rotateX(3deg) rotateY(0deg)`; 
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-3d animation-gradient3d transition-colors duration-700 ${
        theme === 'light' ? 'bg-gradient-light' : 'bg-gradient-dark'
      }`}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl p-10 max-w-md w-full animate-slideInUp transform-style-preserve-3d transition-colors duration-700 ${
          theme === 'light' ? 'text-gray-900 mySecond' : 'text-gray-100 bg-gray-900 bg-opacity-80 myClass'
        }`}
        style={{ transform: 'perspective(800px) rotateX(3deg) rotateY(0deg)' }}
      >
        <h2 className="text-3xl font-extrabold text-center mb-8">
          Welcome Back
        </h2>
        <form className="space-y-6 ">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              onChange={(e)=>setemail(e.target.value)}
              value={email}
              className={`mt-1 block w-full rounded-md border shadow-sm focus:ring-2 transition duration-300 ease-in-out px-4 py-2 outline-none ${
                theme === 'light'
                  ? 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-400 text-gray-900 bg-white'
                  : 'border-gray-600 focus:border-indigo-400 focus:ring-indigo-300 text-gray-100 bg-gray-800'
              }`}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              onChange={(e)=>setpassword(e.target.value)}
              value={password}
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={`mt-1 block w-full rounded-md border shadow-sm focus:ring-2 transition duration-300 ease-in-out px-4 py-2 outline-none ${
                theme === 'light'
                  ? 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-400 text-gray-900 bg-white'
                  : 'border-gray-600 focus:border-indigo-400 focus:ring-indigo-300 text-gray-100 bg-gray-800'
              }`}
              placeholder="••••••••"
            />
          </div>
          <button
          onClick={handleSubmit}
            type="submit"
            className="w-full flex justify-center py-3 px-5 border border-transparent rounded-md shadow cursor-pointer font-semibold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 text-white"
          >
            Sign In
          </button>
        </form>
        <div className='flex w-full items-end justify-end'>
       <Link className=' text-white' to='/forgetpassword'>forgetPassword</Link>
        </div>
        <div className='flex justify-center items-center border-2 border-indigo-600 rounded-lg p-2 mt-4 text-white'>
            <img  width='50px' height='50px' src={google} alt="" />
             <Link
            to='#'
            className="font-medium cursor-pointer"
          >
            Sign up using Google
          </Link>
        </div>

        <p className='text-white mt-2'>Don't have a google account <Link className='border-b text-green-500' to='/signup'>Signup</Link></p>

        {/* Theme toggle button */}
        <div className="mt-6 text-center">
          <button
            onClick={toggleTheme}
            className="text-white px-4 py-2 rounded-full border border-indigo-600 hover:bg-indigo-600 hover:text-white transition duration-300"
          >
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from {opacity: 0;}
            to {opacity: 1;}
          }
          @keyframes slideInUp {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .animation-fadeIn {
            animation: fadeIn 1s ease forwards;
          }
          .animate-slideInUp {
            animation: slideInUp 0.7s ease forwards;
          }

          /* 3D gradient background animation */
          @keyframes gradientShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          .bg-gradient-3d {
            background-size: 200% 200%;
            animation: gradientShift 10s ease-in-out infinite;
            transform-style: preserve-3d;
          }

          /* Light theme gradient */
          .bg-gradient-light {
            background: linear-gradient(90deg, #7c3aed, #4f46e5, #2563eb);
          }

          /* Dark theme gradient */
          .bg-gradient-dark {
            background: linear-gradient(90deg, #1e293b, #3b82f6, #6366f1);
          }

          .transform-style-preserve-3d {
            transform-style: preserve-3d;
          }
            .myClass{
            background: #5417e3;
background: linear-gradient(179deg, rgba(84, 23, 227, 0.88) 0%, rgba(87, 199, 133, 1) 50%, rgba(237, 221, 83, 1) 100%);
            }
.mySecond{
background: #020024;
background: linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 35%, rgba(0, 212, 255, 1) 100%);
}
        `}
      </style>
    </div>
  );
};

export default Login;
