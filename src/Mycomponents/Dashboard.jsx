import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Rate } from 'antd';

const FreelancerDashboard = () => {
 
  const [notifications, setNotifications] = useState(3);
  const userData =useSelector((state)=> state.user);
 
    const [myApplications, setMyApplications] = useState([]);
   

 
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setAnimate(true);
  }, []);

 const fetchMyApplications = async () => {
    try {
      const apiUrl = 'https://freelancing-backend-z0fy.onrender.com/api/jobs/applied_jobs';
      const response = await axios.get(apiUrl, {
        withCredentials: true,
      });

      if (response.status >= 200 && response.status < 300) {
        setMyApplications(response.data.appliedJobs|| []);
      } else {
        setError(`Failed to fetch applications: Server responded with status ${response.status}`);
        console.error('Failed to fetch applications:', response.status, response.data);
        setMyApplications(response.data.appliedJobs);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setMyApplications(response.data.appliedJobs);
     
    } catch (err) {
      console.error('An error occurred during mock data loading:', err);
      setMyApplications([]);
    }
  };

  useEffect(() => {
    fetchMyApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#e1b382] via-[#c89666] to-[#2d545e] text-gray-900 p-6">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl p-8 mt-10">
        {/* Header */}
        <header className="flex justify-between items-center border-b border-gray-300 pb-4 mb-6">
          <div className="text-2xl font-bold tracking-wide">
            <img className='w-[100px] h-[100px] rounded-full' src={userData.user?.profilePicture} alt="" />
          </div>
          <h1 className="text-xl font-semibold">Your Dashboard</h1>
        </header>

        {/* Profile Summary */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3 border-b border-gray-300 pb-2">Profile Summary:</h2>
          <ul className="space-y-1 text-gray-700">
            <li><strong>Name:</strong>{userData.user?.name}</li>
           <li>
  <strong>Skills:</strong>{" "}
  {userData.user?.skills?.length > 0
    ? userData.user?.skills.join(", ")
    : "Add your Skills from profile section"}
</li>

            <li className="flex items-center">
              <strong>Rating:</strong> 
             {userData?.user?.avgRating && (
  <div className="flex items-center">
    <Rate allowHalf disabled defaultValue={userData.user.avgRating} />
    <span className="ml-2 text-yellow-600 font-semibold">
      {userData.user.avgRating.toFixed(1)}
    </span>
  </div>
)}
            </li>
          </ul>
        </section>

        {/* Notifications */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3 border-b border-gray-300 pb-2">Notifications:</h2>
          <p className="text-gray-700">{notifications} New Job Alert{notifications > 1 ? 's' : ''}</p>
        </section>

        {/* Action Buttons */}
        <section className="flex space-x-4 mb-8">
          <Link
          to='/yourDashboard/application'
           
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-center py-3 rounded-md shadow transition duration-300"
          >
            View Applications
          </Link>
          <Link to = '/yourDashboard/UserProfile'
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-3 rounded-md shadow transition duration-300 text-center"
          >
            Edit Profile
          </Link>
        </section>

        {/* Assigned Jobs List */}
        <section>
          <h2 className="text-lg font-semibold mb-3 border-b border-gray-300 pb-2">List of Applied Jobs:</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {myApplications.map((job, index) => (
              <li
                key={job._id}
                className={`transform transition duration-500 ease-out opacity-0 translate-y-6 ${
                  animate ? 'opacity-100 translate-y-0' : ''
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
              <strong>Job {index + 1}:</strong> {job.title} (
  {
    (() => {
      const today = new Date().setHours(0, 0, 0, 0);
      const deadline = new Date(job.deadline).setHours(0, 0, 0, 0);
      const diff = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
      return diff > 0 ? `Due in ${diff} day${diff !== 1 ? 's' : ''}` : 'Expired';
    })()
  }
)


              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
