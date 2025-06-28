import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Rate } from 'antd';
import { IndianRupee, MapPin } from 'lucide-react';
const ClientDashboard = () => {
  const [notifications, setNotifications] = useState(3);
    const [rating, setRating] = useState(0);
  const userData =useSelector((state)=> state.user);
  const [jobs, setJobs] = useState([]);

  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setAnimate(true);
  }, []);
 
useEffect(()=>{
 const postedJob = async()=>{
  try {
    const res = await axios.get(`https://freelancing-backend-z0fy.onrender.com/api/jobs/posted_jobs`,{
      withCredentials:true,
    })
    console.log(res.data)
    setJobs(res.data)
  } catch (error) {
    console.log(error)
  }
 }
 postedJob()
},[])

  const handleRateChange = (value) => {
    console.log("User rated:", value); // log to console
    setRating(value); // update state
  };
  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#e1b382] via-[#c89666] to-[#2d545e] text-gray-900 p-6">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl p-8 mt-10">
        {/* Header */}
        <header className="flex justify-between items-center border-b border-gray-300 pb-4 mb-6">
          <div className="text-2xl font-bold tracking-wide">
            <img className='w-[100px] h-[100px] rounded-full' src={userData?.user?.profilePicture} alt="" />
          </div>
          <h1 className="text-xl font-semibold">Your Dashboard</h1>
        </header>

        {/* Profile Summary */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3 border-b border-gray-300 pb-2">Profile Summary:</h2>
          <ul className="space-y-1 text-gray-700">
            <li><strong>Name:</strong>{userData?.user?.name}</li>
           <li>
  <strong>Skills:</strong>{" "}
  {userData?.user?.skills?.length > 0
    ? userData?.user?.skills.join(", ")
    : "Add your Skills from profile section"}
</li>

            <li className="flex items-center">
              <strong>Rating:</strong> 
              <span className="ml-2 text-yellow-500 font-semibold flex items-center">
                4.5 <span className="ml-1 text-xl"> <Rate onChange={handleRateChange} value={rating} />;</span>
                 {/* <p>Your Rating: {rating} star{rating !== 1 ? 's' : ''}</p> */}
              </span>
            </li>
          </ul>
        </section>

        {/* Notifications */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3 border-b border-gray-300 pb-2">Notifications:</h2>
          <p className="text-gray-700">{notifications} New Application{notifications > 1 ? 's' : ''}</p>
        </section>

        {/* Action Buttons */}
        <section className="flex space-x-4 mb-8">
          <Link to = '/client-posted'
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md shadow transition duration-300 text-center"
          >
            View Posted Project 
          </Link>
          <Link to = '/yourDashboard/UserProfile'
           
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-3 rounded-md shadow transition duration-300 text-center"
          >
            Edit Profile
          </Link>
        </section>

        {/* Assigned Jobs List */}
        <section>
          <h2 className="text-lg font-semibold mb-3 border-b border-gray-300 pb-2">List of Assigned Jobs:</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
        {jobs
  ?.filter(job => job.applicants?.some(app => app.status === "Accepted"))
  .map(job => (
    <div key={job._id} style={{ border: '1px solid gray', margin: '20px', padding: '10px' }}>
      <h3>{job.title}</h3>
      <p className="text-gray-600 flex items-center mb-1">
                     <MapPin className="w-4 h-4 mr-2 text-indigo-500" /> {job.city}
                   </p>
                   <p className="text-gray-600 flex items-center mb-1">
                     <IndianRupee className="w-4 h-4 mr-2 text-green-600" /> Budget: INR {job.budget?.toLocaleString('en-IN')}
                   </p>

      <h4>✅ Accepted Applicants:</h4>

      {job.applicants
        ?.filter(app => app.status === "Accepted")
        .map(app => (
          <div key={app._id} style={{ marginLeft: '20px' }}>
            <p><strong>Name:</strong> {app.freelancer.name}</p>
            <p><strong>Email:</strong> {app.freelancer.email}</p>
            <p><strong>Applied At:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
          </div>
        ))}
    </div>
))}




          </ul>
        </section>
      </div>
    </div>
  );
};

export default ClientDashboard;
