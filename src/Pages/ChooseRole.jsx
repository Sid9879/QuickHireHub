import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/userSlice';

const ChooseRole = () => {
  const navigate = useNavigate();
   const dispatch = useDispatch();
  //  const getUserProfile = async () => {
  //   try {
  //     const response = await axios.get(`https://freelancing-backend-z0fy.onrender.com/api/auth/getUser`, {
  //       withCredentials: true,
  //     });
  //     const user = response.data.user;
  //     dispatch(loginUser(user));
  //   } catch (error) {
  //     console.error("Failed to get user profile:", error);
  //   }
  // };

 const handleSelectRole = async (role) => {
  try {
    await axios.post(
      'https://freelancing-backend-z0fy.onrender.com/api/auth/set-role',
      { role },
      { withCredentials: true }
    );

    const response = await axios.get(
      'https://freelancing-backend-z0fy.onrender.com/api/auth/getUser',
      { withCredentials: true }
    );

    const updatedUser = response.data.user;
    dispatch(loginUser(updatedUser)); // this will include the new role
    navigate('/');
  } catch (err) {
    console.error('Failed to set role', err);
  }
};


  useEffect(() => {
  getUserProfile().then((user) => {
    if (user?.role) navigate('/');
  });
}, []);




  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Choose Your Path</h1>
        <p className="text-lg text-gray-600 mb-10">Select the role that best describes how you'll use our platform.</p>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {/* Freelancer Card */}
          <div
            className="flex-1 border border-blue-300 rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 bg-blue-50 hover:bg-blue-100"
            onClick={() => handleSelectRole('freelancer')}
          >
            <h2 className="text-2xl font-semibold text-blue-700 mb-3">I'm a Freelancer</h2>
            <p className="text-gray-700 text-base mb-4">
              Offer your skills and expertise to clients. Find projects, collaborate, and grow your career.
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors duration-300">
              Join as Freelancer
            </button>
          </div>

          {/* Client Card */}
          <div
            className="flex-1 border border-green-300 rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 bg-green-50 hover:bg-green-100"
            onClick={() => handleSelectRole('client')}
          >
            <h2 className="text-2xl font-semibold text-green-700 mb-3">I'm a Client</h2>
            <p className="text-gray-700 text-base mb-4">
              Hire talented professionals for your projects. Post jobs, manage tasks, and get work done.
            </p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg text-lg font-medium hover:bg-green-700 transition-colors duration-300">
              Hire a Freelancer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseRole;