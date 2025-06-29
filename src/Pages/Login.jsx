import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/userSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cardRef = useRef(null);
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [theme, setTheme] = useState('light');

  const getUserProfile = async () => {
    try {
      const response = await axios.get(`https://freelancing-backend-z0fy.onrender.com/api/auth/getUser`, {
        withCredentials: true,
      });
      const user = response.data.user;
      dispatch(loginUser(user));
    } catch (error) {
      console.error("Failed to get user profile:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.post(`https://freelancing-backend-z0fy.onrender.com/api/auth/login`, { email, password }, {
        withCredentials: true
      });
      let data = res.data;
      if (data.success) {
        toast.success(data.message, { position: "top-center", theme: "dark" });
        await getUserProfile();
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed", { position: "top-center", theme: "dark" });
    }
  };

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
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
    <div className={`min-h-screen flex items-center justify-center bg-gradient-3d transition-colors duration-700 ${theme === 'light' ? 'bg-gradient-light' : 'bg-gradient-dark'}`}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl p-10 max-w-md w-full animate-slideInUp transition-colors duration-700 ${theme === 'light' ? 'text-gray-900 mySecond' : 'text-gray-100 bg-gray-900 bg-opacity-80 myClass'}`}
        style={{ transform: 'perspective(800px) rotateX(3deg) rotateY(0deg)' }}
      >
        <h2 className="text-3xl font-extrabold text-center mb-8">Welcome Back</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className={`mt-1 block w-full rounded-md px-4 py-2 outline-none ${
                theme === 'light'
                  ? 'border border-gray-300 text-gray-900 bg-white focus:ring-indigo-400'
                  : 'border border-gray-600 text-gray-100 bg-gray-800 focus:ring-indigo-300'
              }`}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              className={`mt-1 block w-full rounded-md px-4 py-2 outline-none ${
                theme === 'light'
                  ? 'border border-gray-300 text-gray-900 bg-white focus:ring-indigo-400'
                  : 'border border-gray-600 text-gray-100 bg-gray-800 focus:ring-indigo-300'
              }`}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-5 rounded-md font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            Sign In
          </button>
        </form>

        <div className="flex justify-end mt-2">
          <Link className="text-sm text-blue-300 underline" to="/forgetpassword">Forgot password?</Link>
        </div>

        <div className="flex justify-center items-center p-4 mt-6 bg-white rounded-lg shadow-sm">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const decoded = jwt_decode(credentialResponse.credential);
                const { data } = await axios.post(
                  "https://freelancing-backend-z0fy.onrender.com/api/auth/google-login",
                  {
                    profileObj: {
                      email: decoded.email,
                      name: decoded.name,
                      imageUrl: decoded.picture,
                      googleId: decoded.sub
                    }
                  },
                  { withCredentials: true }
                );
                toast.success("Google login successful!", { position: "top-center", theme: "dark" });
                await getUserProfile();
                if (!data.user?.role) {
                  navigate("/choose-role");
                } else {
                  navigate("/");
                }
              } catch (err) {
                console.error("Google login error:", err);
                toast.error("Google login failed. Try again.", { position: "top-center", theme: "dark" });
              }
            }}
            onError={() => {
              toast.error("Google login failed. Try again.");
            }}
          />
        </div>

        <p className="mt-4 text-center text-sm">
          Don't have an account? <Link className="text-blue-300 underline" to="/signup">Sign up</Link>
        </p>

        <div className="mt-6 text-center">
          <button
            onClick={toggleTheme}
            className="text-sm border px-4 py-2 rounded-full transition hover:bg-indigo-600"
          >
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
          </button>
        </div>
      </div>

      {/* Animations and Themes */}
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .bg-gradient-3d {
            background-size: 200% 200%;
            animation: gradientShift 10s ease-in-out infinite;
          }
          .bg-gradient-light {
            background: linear-gradient(90deg, #7c3aed, #4f46e5, #2563eb);
          }
          .bg-gradient-dark {
            background: linear-gradient(90deg, #1e293b, #3b82f6, #6366f1);
          }
          .myClass {
            background: linear-gradient(179deg, rgba(84, 23, 227, 0.88) 0%, rgba(87, 199, 133, 1) 50%, rgba(237, 221, 83, 1) 100%);
          }
          .mySecond {
            background: linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 35%, rgba(0, 212, 255, 1) 100%);
          }
          .animate-slideInUp {
            animation: slideInUp 0.7s ease forwards;
          }
          @keyframes slideInUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default Login;
