import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  MapPin,
  IndianRupee,
  Calendar,
  Clipboard,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function JobDetailsPage() {
  let location = useLocation();
  
   const handleApply =async(jobId) => {
    const check = window.confirm("Are you sure you want to apply for this job?");
    if (!check) {
      return;
    }
  try {
  const apiUrl = `https://freelancing-backend-z0fy.onrender.com/api/jobs/apply/${jobId}`;
  const response = await axios.post(
    apiUrl,
    {},
    { withCredentials: true }
  );

  // console.log("Response:", response.data);
  
  if (response.data) {
    toast.success(response.data.message || "Successfully applied for the job!", {
      position: "top-center",
    });
  }
} catch (error) {
  console.error("Error applying for job:", error);
  toast.error(
    error.response?.data?.message || "Failed to apply for the job.",
    {
      position: "top-center",
    }
  );
}

  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-4 sm:p-6 lg:p-8 font-sans">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-8 text-center leading-tight mt-9">
        Project Details
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{location.state?.title}</h2>
        <p className="text-gray-500 text-sm mb-2">Posted by: {location.state?.client.name}</p>
        <p className="text-gray-600 flex items-center mb-1">
          <MapPin className="w-4 h-4 mr-2 text-indigo-500" /> {location.state?.city}
        </p>
        <p className="text-gray-600 flex items-center mb-4">
          <IndianRupee className="w-4 h-4 mr-2 text-green-600" /> Budget: INR {location.state?.budget?.toLocaleString('en-IN')}
        </p>
        <p className="text-gray-600 flex items-center mb-4">
          <Calendar className="w-4 h-4 mr-2 text-blue-600" /> Posted on: {new Date(location.state?.createdAt).toLocaleDateString()}
        </p>
         <p className="flex items-center text-gray-600 text-sm mb-4">
                      <Calendar className="w-4 h-4 mr-2 text-red-500" /> Deadline: {location.state?.deadline ? new Date(location.state.deadline).toLocaleDateString() : 'N/A'}
                    </p>
        <p className="text-gray-600 flex items-center mb-4">
          <Clipboard className="w-4 h-4 mr-2 text-purple-500" /> {location.state?.description}
        </p>
      <div className='flex flex-col md:flex-row justify-center items-center gap-4'>
             <button
             onClick={()=>handleApply(location.state?._id)}
              className="mt-auto flex items-center justify-center px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 text-base group"
            >
              Apply Now
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
             <Link to = '/jobs'
              className="mt-auto flex items-center justify-center px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 text-base group"
            >
              Go Back
              <ArrowLeft className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
           </div>
      </div>
    </div>
  )
}
